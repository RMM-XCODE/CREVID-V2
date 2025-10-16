import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents, files, gofileFolders } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { generateId, sanitizeFilename } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { openaiService } from '@/services/openaiService';
import { gofileService } from '@/services/gofileService';
import { asyncHandler, createError } from '@/middleware/errorHandler';

export const processMediaGeneration = asyncHandler(async (req: Request, res: Response) => {
  const { job_id, content_id, scene_ids, media_type, presets } = req.body;

  if (!job_id || !content_id || !scene_ids) {
    throw createError('Job ID, content ID, and scene IDs are required', 400);
  }

  logger.info('Processing media generation job', { 
    job_id, 
    content_id, 
    scene_ids, 
    media_type 
  });

  try {
    // Update job status to processing
    await db.update(jobs)
      .set({ 
        status: 'processing', 
        startedAt: new Date().toISOString(),
        progress: 5
      })
      .where(eq(jobs.id, job_id));

    // Get content details
    const content = await db
      .select()
      .from(contents)
      .where(eq(contents.id, content_id))
      .limit(1);

    if (!content[0]) {
      throw new Error('Content not found');
    }

    // Check if GoFile folder exists, create if not
    let gofileFolder = await db
      .select()
      .from(gofileFolders)
      .where(eq(gofileFolders.contentId, content_id))
      .limit(1);

    if (!gofileFolder[0]) {
      logger.info('Creating GoFile folder for content');
      
      // Use mock service for development
      const folderResult = await gofileService.mockCreateFolder(content[0].title);
      
      // Save folder info
      const folderId = generateId();
      await db.insert(gofileFolders).values({
        id: folderId,
        contentId: content_id,
        jobId: job_id,
        folderId: folderResult.folderId,
        folderUrl: folderResult.folderUrl,
        folderName: folderResult.folderName
      });

      gofileFolder = [{
        id: folderId,
        contentId: content_id,
        jobId: job_id,
        folderId: folderResult.folderId,
        folderUrl: folderResult.folderUrl,
        folderName: folderResult.folderName,
        createdAt: new Date().toISOString()
      }];
    }

    // Update progress
    await db.update(jobs)
      .set({ progress: 20 })
      .where(eq(jobs.id, job_id));

    // Process each scene
    const generatedFiles = [];
    const totalScenes = scene_ids.length;

    for (let i = 0; i < totalScenes; i++) {
      const sceneId = scene_ids[i];
      logger.info(`Processing scene ${sceneId}`, { job_id, sceneId });

      try {
        // Generate media prompt for this scene
        const sceneText = `Scene ${sceneId} content for ${content[0].title}`;
        const mediaPrompt = await openaiService.generateMediaPrompt(sceneText, presets);

        // Simulate media generation and upload to GoFile
        const filename = `scene_${sceneId}_${media_type}.${media_type === 'image' ? 'jpg' : 'mp4'}`;
        const uploadResult = await gofileService.mockUpload(
          filename,
          gofileFolder[0].folderId
        );

        // Save file record
        const fileId = generateId();
        await db.insert(files).values({
          id: fileId,
          contentId: content_id,
          jobId: job_id,
          type: media_type as 'image' | 'video',
          filename: uploadResult.filename,
          gofileUrl: uploadResult.url,
          sceneId: sceneId,
          fileSize: uploadResult.size
        });

        generatedFiles.push({
          scene_id: sceneId,
          filename: uploadResult.filename,
          gofile_url: uploadResult.url,
          media_prompt: mediaPrompt,
          file_size: uploadResult.size
        });

        // Update progress
        const progress = Math.round(20 + ((i + 1) / totalScenes) * 70);
        await db.update(jobs)
          .set({ progress })
          .where(eq(jobs.id, job_id));

        logger.info(`Scene ${sceneId} processed successfully`);

      } catch (sceneError) {
        logger.error(`Failed to process scene ${sceneId}:`, sceneError);
        // Continue with other scenes, don't fail the entire job
      }
    }

    if (generatedFiles.length === 0) {
      throw new Error('No media files were generated successfully');
    }

    // Complete job
    await db.update(jobs)
      .set({
        status: 'completed',
        progress: 100,
        resultData: {
          gofile_folder: {
            folder_id: gofileFolder[0].folderId,
            folder_url: gofileFolder[0].folderUrl,
            folder_name: gofileFolder[0].folderName
          },
          files: generatedFiles,
          media_type,
          total_files: generatedFiles.length
        },
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, job_id));

    logger.info('Media generation job completed', { 
      job_id, 
      content_id,
      files_generated: generatedFiles.length
    });

    res.json({ 
      success: true, 
      message: 'Media generation completed',
      files_generated: generatedFiles.length,
      gofile_folder: gofileFolder[0].folderUrl
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Media generation job failed', { job_id, error: errorMessage });

    // Mark job as failed
    await db.update(jobs)
      .set({
        status: 'failed',
        errorMessage: errorMessage,
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, job_id));

    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});