import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents, files, gofileFolders } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { generateId, formatDuration } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { gofileService } from '@/services/gofileService';
import { asyncHandler, createError } from '@/middleware/errorHandler';

export const processTTSGeneration = asyncHandler(async (req: Request, res: Response) => {
  const { job_id, content_id, script, voice_settings } = req.body;

  if (!job_id || !content_id || !script) {
    throw createError('Job ID, content ID, and script are required', 400);
  }

  logger.info('Processing TTS generation job', { 
    job_id, 
    content_id, 
    script_length: script.length,
    voice: voice_settings?.voice || 'default'
  });

  try {
    // Update job status to processing
    await db.update(jobs)
      .set({ 
        status: 'processing', 
        startedAt: new Date().toISOString(),
        progress: 10
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
      .set({ progress: 30 })
      .where(eq(jobs.id, job_id));

    // Simulate TTS processing
    logger.info('Generating TTS audio');
    
    // Calculate estimated duration (rough estimate: 150 words per minute)
    const wordCount = script.split(' ').length;
    const estimatedDurationSeconds = Math.ceil((wordCount / 150) * 60);
    const duration = formatDuration(estimatedDurationSeconds);

    // Update progress
    await db.update(jobs)
      .set({ progress: 60 })
      .where(eq(jobs.id, job_id));

    // Generate audio files
    const audioFiles = [];

    // Full script audio
    const fullScriptFilename = 'full_script_audio.mp3';
    const fullScriptUpload = await gofileService.mockUpload(
      fullScriptFilename,
      gofileFolder[0].folderId
    );

    const fullScriptFileId = generateId();
    await db.insert(files).values({
      id: fullScriptFileId,
      contentId: content_id,
      jobId: job_id,
      type: 'audio',
      filename: fullScriptUpload.filename,
      gofileUrl: fullScriptUpload.url,
      fileSize: fullScriptUpload.size
    });

    audioFiles.push({
      filename: fullScriptUpload.filename,
      gofile_url: fullScriptUpload.url,
      duration: duration,
      type: 'full_script',
      file_size: fullScriptUpload.size
    });

    // Update progress
    await db.update(jobs)
      .set({ progress: 80 })
      .where(eq(jobs.id, job_id));

    // Scene breakdown audio (if content has scenes)
    if (content[0].scenesCount && content[0].scenesCount > 1) {
      const sceneBreakdownFilename = 'scene_breakdown_audio.zip';
      const sceneBreakdownUpload = await gofileService.mockUpload(
        sceneBreakdownFilename,
        gofileFolder[0].folderId
      );

      const sceneBreakdownFileId = generateId();
      await db.insert(files).values({
        id: sceneBreakdownFileId,
        contentId: content_id,
        jobId: job_id,
        type: 'audio',
        filename: sceneBreakdownUpload.filename,
        gofileUrl: sceneBreakdownUpload.url,
        fileSize: sceneBreakdownUpload.size
      });

      audioFiles.push({
        filename: sceneBreakdownUpload.filename,
        gofile_url: sceneBreakdownUpload.url,
        duration: `${duration} (total)`,
        type: 'scene_breakdown',
        file_size: sceneBreakdownUpload.size
      });
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
          audio_files: audioFiles,
          voice_settings: voice_settings || {
            voice: 'Aria',
            stability: 0.5,
            similarityBoost: 0.75,
            style: 0,
            speed: 1,
            languageCode: 'id-ID'
          },
          total_duration: duration,
          total_files: audioFiles.length
        },
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, job_id));

    logger.info('TTS generation job completed', { 
      job_id, 
      content_id,
      files_generated: audioFiles.length,
      duration
    });

    res.json({ 
      success: true, 
      message: 'TTS generation completed',
      files_generated: audioFiles.length,
      duration,
      gofile_folder: gofileFolder[0].folderUrl
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('TTS generation job failed', { job_id, error: errorMessage });

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