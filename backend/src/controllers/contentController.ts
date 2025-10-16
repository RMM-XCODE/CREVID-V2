import { Request, Response } from 'express';
import { db } from '@/config/database';
import { contents, jobs, files, gofileFolders } from '@/models/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { openaiService } from '@/services/openaiService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { ContentGenerationRequest, ApiResponse } from '@/types';

export const generateContent = asyncHandler(async (req: Request, res: Response) => {
  const { mode, input, presets }: ContentGenerationRequest = req.body;

  if (!mode || !input) {
    throw createError('Mode and input are required', 400);
  }

  logger.info('Content generation request', { mode, inputLength: input.length });

  // Create job record
  const jobId = generateId();
  await db.insert(jobs).values({
    id: jobId,
    type: 'content_generation',
    status: 'processing',
    inputData: { mode, input, presets },
    startedAt: new Date().toISOString()
  });

  try {
    // Generate content directly using OpenAI service
    const generatedContent = await openaiService.generateContent({
      mode,
      input,
      presets: presets || undefined
    });

    // Create script from scenes
    const script = generatedContent.scenes?.map(scene => scene.text).join('\n\n') || '';

    // Create content record
    const contentId = generateId();
    const newContent = await db.insert(contents).values({
      id: contentId,
      title: generatedContent.title,
      description: generatedContent.description,
      script: script,
      scenesCount: generatedContent.scenes?.length || 0,
      status: 'completed'
    }).returning();

    // Update job as completed
    await db.update(jobs)
      .set({ 
        status: 'completed',
        resultData: { contentId, ...generatedContent },
        completedAt: new Date().toISOString(),
        progress: 100
      })
      .where(eq(jobs.id, jobId));

    logger.info('Content generated successfully', { jobId, contentId });

    const response: ApiResponse = {
      success: true,
      data: {
        job_id: jobId,
        content_id: contentId,
        status: 'completed',
        content: newContent[0],
        generated_content: generatedContent
      }
    };

    res.json(response);

  } catch (error) {
    // Update job as failed
    await db.update(jobs)
      .set({ 
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, jobId));

    logger.error('Content generation failed', { jobId, error });
    throw error;
  }
});

export const saveContent = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, script, scenes_count } = req.body;

  if (!title) {
    throw createError('Title is required', 400);
  }

  const contentId = generateId();
  const newContent = await db.insert(contents).values({
    id: contentId,
    title,
    description,
    script,
    scenesCount: scenes_count || 0,
    status: 'draft'
  }).returning();

  logger.info('Content saved', { contentId, title });

  const response: ApiResponse = {
    success: true,
    data: newContent[0]
  };

  res.json(response);
});

export const getContents = asyncHandler(async (req: Request, res: Response) => {
  const contentList = await db
    .select({
      id: contents.id,
      title: contents.title,
      description: contents.description,
      status: contents.status,
      scenesCount: contents.scenesCount,
      createdAt: contents.createdAt,
      updatedAt: contents.updatedAt
    })
    .from(contents)
    .orderBy(desc(contents.createdAt));

  // Get associated files and folders for each content
  const enrichedContents = await Promise.all(
    contentList.map(async (content) => {
      const contentFiles = await db
        .select()
        .from(files)
        .where(eq(files.contentId, content.id));

      const folder = await db
        .select()
        .from(gofileFolders)
        .where(eq(gofileFolders.contentId, content.id))
        .limit(1);

      return {
        ...content,
        hasMedia: contentFiles.some(f => f.type === 'image' || f.type === 'video'),
        hasAudio: contentFiles.some(f => f.type === 'audio'),
        goFileFolder: folder[0] ? {
          folderId: folder[0].folderId,
          folderUrl: folder[0].folderUrl,
          folderName: folder[0].folderName
        } : null
      };
    })
  );

  const response: ApiResponse = {
    success: true,
    data: enrichedContents
  };

  res.json(response);
});

export const getContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const content = await db
    .select()
    .from(contents)
    .where(eq(contents.id, id))
    .limit(1);

  if (!content[0]) {
    throw createError('Content not found', 404);
  }

  // Get associated files
  const contentFiles = await db
    .select()
    .from(files)
    .where(eq(files.contentId, id));

  // Get GoFile folder
  const folder = await db
    .select()
    .from(gofileFolders)
    .where(eq(gofileFolders.contentId, id))
    .limit(1);

  const response: ApiResponse = {
    success: true,
    data: {
      ...content[0],
      files: contentFiles,
      goFileFolder: folder[0] ? {
        folderId: folder[0].folderId,
        folderUrl: folder[0].folderUrl,
        folderName: folder[0].folderName
      } : null
    }
  };

  res.json(response);
});

export const updateContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, script } = req.body;

  const updatedContent = await db
    .update(contents)
    .set({
      title,
      description,
      script,
      updatedAt: new Date().toISOString()
    })
    .where(eq(contents.id, id))
    .returning();

  if (!updatedContent[0]) {
    throw createError('Content not found', 404);
  }

  logger.info('Content updated', { contentId: id });

  const response: ApiResponse = {
    success: true,
    data: updatedContent[0]
  };

  res.json(response);
});

export const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Delete content (cascade will handle related records)
  const deletedContent = await db
    .delete(contents)
    .where(eq(contents.id, id))
    .returning();

  if (!deletedContent[0]) {
    throw createError('Content not found', 404);
  }

  logger.info('Content deleted', { contentId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Content deleted successfully'
  };

  res.json(response);
});