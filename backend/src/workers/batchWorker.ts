import { Request, Response } from 'express';
import { db } from '@/config/database';
import { jobs, contents } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { qstashService } from '@/services/qstashService';
import { asyncHandler, createError } from '@/middleware/errorHandler';

export const processBatchOperation = asyncHandler(async (req: Request, res: Response) => {
  const { job_id, content_id, operation, scene_ids, presets, script, voice_settings } = req.body;

  if (!job_id || !content_id || !operation) {
    throw createError('Job ID, content ID, and operation are required', 400);
  }

  logger.info('Processing batch operation job', { 
    job_id, 
    content_id, 
    operation 
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

    const results = [];
    let totalOperations = 0;
    let completedOperations = 0;

    // Determine operations to perform
    const operations = [];
    
    if (operation === 'media_generation' || operation === 'all') {
      operations.push({
        type: 'media_generation',
        endpoint: '/api/workers/media-generation',
        payload: {
          content_id,
          scene_ids: scene_ids || Array.from({ length: content[0].scenesCount || 5 }, (_, i) => i + 1),
          media_type: 'image',
          presets
        }
      });
    }

    if (operation === 'tts_generation' || operation === 'all') {
      operations.push({
        type: 'tts_generation',
        endpoint: '/api/workers/tts-generation',
        payload: {
          content_id,
          script: script || content[0].script,
          voice_settings
        }
      });
    }

    totalOperations = operations.length;

    if (totalOperations === 0) {
      throw new Error('No valid operations specified');
    }

    // Update progress
    await db.update(jobs)
      .set({ progress: 10 })
      .where(eq(jobs.id, job_id));

    // Execute operations sequentially
    for (const op of operations) {
      try {
        logger.info(`Executing batch operation: ${op.type}`, { job_id });

        // Create a sub-job for this operation
        const subJobId = `${job_id}_${op.type}`;
        
        // For batch operations, we'll simulate the work directly
        // In a real implementation, you might want to create actual sub-jobs
        
        if (op.type === 'media_generation') {
          // Simulate media generation
          await simulateMediaGeneration(content_id, op.payload.scene_ids, job_id);
        } else if (op.type === 'tts_generation') {
          // Simulate TTS generation
          await simulateTTSGeneration(content_id, op.payload.script, job_id);
        }

        completedOperations++;
        const progress = Math.round(10 + (completedOperations / totalOperations) * 80);
        
        await db.update(jobs)
          .set({ progress })
          .where(eq(jobs.id, job_id));

        results.push({
          operation: op.type,
          status: 'completed',
          message: `${op.type} completed successfully`
        });

        logger.info(`Batch operation ${op.type} completed`, { job_id });

      } catch (operationError) {
        const errorMessage = operationError instanceof Error ? operationError.message : 'Unknown error';
        logger.error(`Batch operation ${op.type} failed:`, operationError);
        
        results.push({
          operation: op.type,
          status: 'failed',
          error: errorMessage
        });
        
        // Continue with other operations
      }
    }

    // Determine overall job status
    const hasFailures = results.some(r => r.status === 'failed');
    const hasSuccesses = results.some(r => r.status === 'completed');
    
    let finalStatus = 'completed';
    let finalMessage = 'All batch operations completed successfully';
    
    if (hasFailures && !hasSuccesses) {
      finalStatus = 'failed';
      finalMessage = 'All batch operations failed';
    } else if (hasFailures && hasSuccesses) {
      finalStatus = 'completed';
      finalMessage = 'Batch operations completed with some failures';
    }

    // Complete job
    await db.update(jobs)
      .set({
        status: finalStatus as any,
        progress: 100,
        resultData: {
          operation_type: operation,
          total_operations: totalOperations,
          completed_operations: results.filter(r => r.status === 'completed').length,
          failed_operations: results.filter(r => r.status === 'failed').length,
          results,
          message: finalMessage
        },
        completedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, job_id));

    logger.info('Batch operation job completed', { 
      job_id, 
      content_id,
      operation,
      total_operations: totalOperations,
      completed: results.filter(r => r.status === 'completed').length,
      failed: results.filter(r => r.status === 'failed').length
    });

    res.json({ 
      success: true, 
      message: finalMessage,
      total_operations: totalOperations,
      completed_operations: results.filter(r => r.status === 'completed').length,
      failed_operations: results.filter(r => r.status === 'failed').length,
      results
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Batch operation job failed', { job_id, error: errorMessage });

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

// Helper functions for simulating operations
async function simulateMediaGeneration(contentId: string, sceneIds: number[], jobId: string) {
  // Simulate media generation process
  logger.info('Simulating media generation', { contentId, sceneIds, jobId });
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In real implementation, this would call the actual media generation logic
  return {
    success: true,
    files_generated: sceneIds.length,
    message: 'Media generation completed'
  };
}

async function simulateTTSGeneration(contentId: string, script: string, jobId: string) {
  // Simulate TTS generation process
  logger.info('Simulating TTS generation', { contentId, scriptLength: script?.length || 0, jobId });
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In real implementation, this would call the actual TTS generation logic
  return {
    success: true,
    audio_files: 2,
    message: 'TTS generation completed'
  };
}