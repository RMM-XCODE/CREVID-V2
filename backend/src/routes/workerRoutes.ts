import { Router } from 'express';
import { processContentGeneration } from '@/workers/contentWorker';
import { processMediaGeneration } from '@/workers/mediaWorker';
import { processTTSGeneration } from '@/workers/ttsWorker';
import { processBatchOperation } from '@/workers/batchWorker';
import { verifyQStashSignature } from '@/middleware/qstashAuth';

const router = Router();

// Worker endpoints for QStash callbacks
// These endpoints are called by QStash to process background jobs
router.post('/content-generation', verifyQStashSignature, processContentGeneration);
router.post('/media-generation', verifyQStashSignature, processMediaGeneration);
router.post('/tts-generation', verifyQStashSignature, processTTSGeneration);
router.post('/batch-operation', verifyQStashSignature, processBatchOperation);

export default router;