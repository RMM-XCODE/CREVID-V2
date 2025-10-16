import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { generateId, estimateProcessingTime } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { qstashService } from '@/services/qstashService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { TTSGenerationRequest, ApiResponse } from '@/types';

export const generateTTS = asyncHandler(async (req: Request, res: Response) => {
  const { content_id, script, voice_settings }: TTSGenerationRequest = req.body;

  if (!content_id || !script) {
    throw createError('Content ID and script are required', 400);
  }

  logger.info('TTS generation request', { 
    content_id, 
    scriptLength: script.length,
    voice: voice_settings?.voice || 'default'
  });

  // Verify content exists
  const content = await db
    .select()
    .from(contents)
    .where(eq(contents.id, content_id))
    .limit(1);

  if (!content[0]) {
    throw createError('Content not found', 404);
  }

  // Create job record
  const jobId = generateId();
  await db.insert(jobs).values({
    id: jobId,
    contentId: content_id,
    type: 'tts_generation',
    status: 'queued',
    inputData: { content_id, script, voice_settings },
  });

  // Queue the job
  const qstashResponse = await qstashService.publishJob(
    '/api/workers/tts-generation',
    { job_id: jobId, content_id, script, voice_settings },
    { 
      retries: 3,
      delay: 3 // 3 second delay for TTS processing
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
      estimated_time: estimateProcessingTime('tts_generation')
    }
  };

  res.json(response);
});

export const generateBatchTTS = asyncHandler(async (req: Request, res: Response) => {
  const { content_id, voice_settings } = req.body;

  if (!content_id) {
    throw createError('Content ID is required', 400);
  }

  logger.info('Batch TTS generation request', { content_id });

  // Get content script
  const content = await db
    .select()
    .from(contents)
    .where(eq(contents.id, content_id))
    .limit(1);

  if (!content[0]) {
    throw createError('Content not found', 404);
  }

  if (!content[0].script) {
    throw createError('Content has no script to convert', 400);
  }

  // Create job record
  const jobId = generateId();
  await db.insert(jobs).values({
    id: jobId,
    contentId: content_id,
    type: 'batch_operation',
    status: 'queued',
    inputData: { 
      content_id, 
      operation: 'tts_generation', 
      script: content[0].script, 
      voice_settings 
    },
  });

  // Queue the job
  const qstashResponse = await qstashService.publishJob(
    '/api/workers/batch-operation',
    { 
      job_id: jobId, 
      content_id, 
      operation: 'tts_generation', 
      script: content[0].script, 
      voice_settings 
    },
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
      estimated_time: estimateProcessingTime('batch_operation')
    }
  };

  res.json(response);
});