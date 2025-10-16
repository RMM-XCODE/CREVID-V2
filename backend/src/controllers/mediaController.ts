import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { generateId, estimateProcessingTime } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { qstashService } from '@/services/qstashService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { MediaGenerationRequest, ApiResponse } from '@/types';

export const generateMedia = asyncHandler(async (req: Request, res: Response) => {
  const { content_id, scene_ids, media_type, presets }: MediaGenerationRequest = req.body;

  if (!content_id || !scene_ids || !Array.isArray(scene_ids) || scene_ids.length === 0) {
    throw createError('Content ID and scene IDs are required', 400);
  }

  if (!['image', 'video'].includes(media_type)) {
    throw createError('Media type must be image or video', 400);
  }

  logger.info('Media generation request', { 
    content_id, 
    scene_ids, 
    media_type, 
    sceneCount: scene_ids.length 
  });

  // Create job record
  const jobId = generateId();
  await db.insert(jobs).values({
    id: jobId,
    contentId: content_id,
    type: 'media_generation',
    status: 'queued',
    inputData: { content_id, scene_ids, media_type, presets },
  });

  // Queue the job
  const qstashResponse = await qstashService.publishJob(
    '/api/workers/media-generation',
    { job_id: jobId, content_id, scene_ids, media_type, presets },
    { 
      retries: 3,
      delay: 2 // 2 second delay to allow for proper setup
    }
  );

  // Update job with QStash message ID
  await db.update(jobs)
    .set({ qstashMessageId: qstashResponse.messageId })
    .where(eq(jobs.id, jobId));

  const response: ApiResponse = {
    success: true,
    data: {
      job_id: jobId,
      status: 'queued',
      estimated_time: estimateProcessingTime('media_generation', scene_ids.length)
    }
  };

  res.json(response);
});

export const generateBatchMedia = asyncHandler(async (req: Request, res: Response) => {
  const { content_id, presets } = req.body;

  if (!content_id) {
    throw createError('Content ID is required', 400);
  }

  logger.info('Batch media generation request', { content_id });

  // Get content to determine scene count
  const content = await db
    .select()
    .from(contents)
    .where(eq(contents.id, content_id))
    .limit(1);

  if (!content[0]) {
    throw createError('Content not found', 404);
  }

  const sceneCount = content[0].scenesCount || 5;
  const scene_ids = Array.from({ length: sceneCount }, (_, i) => i + 1);

  // Create job record
  const jobId = generateId();
  await db.insert(jobs).values({
    id: jobId,
    contentId: content_id,
    type: 'batch_operation',
    status: 'queued',
    inputData: { content_id, operation: 'media_generation', scene_ids, presets },
  });

  // Queue the job
  const qstashResponse = await qstashService.publishJob(
    '/api/workers/batch-operation',
    { job_id: jobId, content_id, operation: 'media_generation', scene_ids, presets },
    { 
      retries: 3,
      delay: 5 // 5 second delay for batch operations
    }
  );

  // Update job with QStash message ID
  await db.update(jobs)
    .set({ qstashMessageId: qstashResponse.messageId })
    .where(eq(jobs.id, jobId));

  const response: ApiResponse = {
    success: true,
    data: {
      job_id: jobId,
      status: 'queued',
      estimated_time: estimateProcessingTime('batch_operation', sceneCount)
    }
  };

  res.json(response);
});