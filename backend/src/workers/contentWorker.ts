import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { openaiService } from '@/services/openaiService';
import { asyncHandler, createError } from '@/middleware/errorHandler';

export const processContentGeneration = asyncHandler(async (req: Request, res: Response) => {
  const { job_id, mode, input, presets } = req.body;

  if (!job_id) {
    throw createError('Job ID is required', 400);
  }

  logger.info('Processing content generation job', { job_id, mode });

  try {
    // Update job status to processing
    await db.update(jobs)
      .set({ 
        status: 'processing', 
        startedAt: new Date().toISOString(),
        progress: 10
      })
      .where(eq(jobs.id, job_id));

    // Generate content with OpenAI
    logger.info('Calling OpenAI for content generation');
    const generatedContent = await openaiService.generateContent({
      mode,
      input,
      presets
    });

    // Update progress
    await db.update(jobs)
      .set({ progress: 70 })
      .where(eq(jobs.id, job_id));

    // Create content record
    const contentId = generateId();
    const newContent = await db.insert(contents).values({
      id: contentId,
      title: generatedContent.title,
      description: generatedContent.description,
      script: generatedContent.scenes.map(scene => scene.text).join('\n\n'),
      scenesCount: generatedContent.scenes.length,
      status: 'completed'
    }).returning();

    // Update progress
    await db.update(jobs)
      .set({ progress: 90 })
      .where(eq(jobs.id, job_id));

    // Complete job
    await db.update(jobs)
      .set({
        status: 'completed',
        progress: 100,
        resultData: {
          content_id: contentId,
          title: generatedContent.title,
          description: generatedContent.description,
          scenes: generatedContent.scenes,
          content: newContent[0]
        },
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, job_id));

    logger.info('Content generation job completed', { 
      job_id, 
      content_id: contentId,
      title: generatedContent.title
    });

    res.json({ 
      success: true, 
      message: 'Content generation completed',
      content_id: contentId
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Content generation job failed', { job_id, error: errorMessage });

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