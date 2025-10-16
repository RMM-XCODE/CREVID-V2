import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, files, gofileFolders } from '@/models/schema';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { qstashService } from '@/services/qstashService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { ApiResponse, JobResponse } from '@/types';

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const { job_id } = req.params;

  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, job_id))
    .limit(1);

  if (!job[0]) {
    throw createError('Job not found', 404);
  }

  const jobData = job[0];
  
  // Get associated files if job is completed
  let jobFiles: any[] = [];
  let goFileFolder = null;
  
  if (jobData.status === 'completed' && jobData.contentId) {
    jobFiles = await db
      .select()
      .from(files)
      .where(eq(files.jobId, job_id));

    const folder = await db
      .select()
      .from(gofileFolders)
      .where(eq(gofileFolders.jobId, job_id))
      .limit(1);

    if (folder[0]) {
      goFileFolder = {
        folderId: folder[0].folderId,
        folderUrl: folder[0].folderUrl,
        folderName: folder[0].folderName
      };
    }
  }

  const response: ApiResponse<JobResponse> = {
    success: true,
    data: {
      job_id: jobData.id,
      status: jobData.status as any,
      progress: jobData.progress || 0,
      result_data: jobData.status === 'completed' ? (
        jobData.resultData || {
          files: jobFiles,
          goFileFolder
        }
      ) : undefined,
      error_message: jobData.errorMessage || undefined
    }
  };

  res.json(response);
});

export const getJobsByContent = asyncHandler(async (req: Request, res: Response) => {
  const { content_id } = req.params;

  const contentJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.contentId, content_id))
    .orderBy(desc(jobs.createdAt));

  const response: ApiResponse = {
    success: true,
    data: contentJobs.map(job => ({
      job_id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress || 0,
      created_at: job.createdAt,
      completed_at: job.completedAt,
      error_message: job.errorMessage
    }))
  };

  res.json(response);
});

export const getAllJobs = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, limit = 50 } = req.query;

  let query = db.select().from(jobs);

  // Apply filters
  const conditions: any[] = [];
  if (status && ['queued', 'processing', 'completed', 'failed'].includes(status as string)) {
    conditions.push(eq(jobs.status, status as any));
  }
  if (type && ['content_generation', 'media_generation', 'tts_generation', 'batch_operation'].includes(type as string)) {
    conditions.push(eq(jobs.type, type as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const allJobs = await query
    .orderBy(desc(jobs.createdAt))
    .limit(parseInt(limit as string));

  const response: ApiResponse = {
    success: true,
    data: allJobs.map(job => ({
      job_id: job.id,
      content_id: job.contentId,
      type: job.type,
      status: job.status,
      progress: job.progress || 0,
      created_at: job.createdAt,
      started_at: job.startedAt,
      completed_at: job.completedAt,
      error_message: job.errorMessage
    }))
  };

  res.json(response);
});

export const cancelJob = asyncHandler(async (req: Request, res: Response) => {
  const { job_id } = req.params;

  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, job_id))
    .limit(1);

  if (!job[0]) {
    throw createError('Job not found', 404);
  }

  if (job[0].status === 'completed' || job[0].status === 'failed') {
    throw createError('Cannot cancel completed or failed job', 400);
  }

  // Update job status
  await db
    .update(jobs)
    .set({ 
      status: 'failed',
      errorMessage: 'Job cancelled by user',
      completedAt: new Date().toISOString()
    })
    .where(eq(jobs.id, job_id));

  // Try to cancel in QStash if message ID exists
  if (job[0].qstashMessageId) {
    try {
      await qstashService.cancelJob(job[0].qstashMessageId);
    } catch (error) {
      logger.warn('Failed to cancel job in QStash:', error);
    }
  }

  logger.info('Job cancelled', { jobId: job_id });

  const response: ApiResponse = {
    success: true,
    message: 'Job cancelled successfully'
  };

  res.json(response);
});

export const retryJob = asyncHandler(async (req: Request, res: Response) => {
  const { job_id } = req.params;

  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, job_id))
    .limit(1);

  if (!job[0]) {
    throw createError('Job not found', 404);
  }

  if (job[0].status !== 'failed') {
    throw createError('Can only retry failed jobs', 400);
  }

  // Reset job status
  await db
    .update(jobs)
    .set({ 
      status: 'queued',
      errorMessage: null,
      progress: 0,
      startedAt: null,
      completedAt: null
    })
    .where(eq(jobs.id, job_id));

  // Determine worker endpoint based on job type
  const workerEndpoints = {
    content_generation: '/api/workers/content-generation',
    media_generation: '/api/workers/media-generation',
    tts_generation: '/api/workers/tts-generation',
    batch_operation: '/api/workers/batch-operation'
  };

  const endpoint = workerEndpoints[job[0].type as keyof typeof workerEndpoints];
  if (!endpoint) {
    throw createError('Unknown job type', 400);
  }

  // Re-queue the job
  const inputData = job[0].inputData ? JSON.parse(job[0].inputData as string) : {};
  const qstashResponse = await qstashService.publishJob(
    endpoint,
    { job_id: job[0].id, ...inputData },
    { retries: 3 }
  );

  // Update job with new QStash message ID
  await db
    .update(jobs)
    .set({ qstashMessageId: qstashResponse.messageId })
    .where(eq(jobs.id, job_id));

  logger.info('Job retried', { jobId: job_id });

  const response: ApiResponse = {
    success: true,
    message: 'Job queued for retry'
  };

  res.json(response);
});