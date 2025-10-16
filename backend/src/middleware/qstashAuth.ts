import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { decrypt } from '@/utils/helpers';
import { logger } from '@/utils/logger';

export const verifyQStashSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip verification in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info('Skipping QStash signature verification in development mode');
      return next();
    }

    const signature = req.headers['upstash-signature'] as string;
    const timestamp = req.headers['upstash-timestamp'] as string;

    if (!signature || !timestamp) {
      logger.warn('Missing QStash signature or timestamp headers');
      return res.status(401).json({ 
        success: false, 
        error: 'Missing QStash signature headers' 
      });
    }

    // Get signing keys from database
    const settings = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 'default'))
      .limit(1);

    if (!settings[0] || !settings[0].qstashCurrentSigningKey) {
      logger.error('QStash signing keys not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'QStash not configured' 
      });
    }

    const currentSigningKey = decrypt(settings[0].qstashCurrentSigningKey);
    const nextSigningKey = settings[0].qstashNextSigningKey ? 
      decrypt(settings[0].qstashNextSigningKey) : null;

    // Get raw body for signature verification
    const body = JSON.stringify(req.body);
    const payload = `${timestamp}.${body}`;

    // Try current signing key
    const currentSignature = createHmac('sha256', currentSigningKey)
      .update(payload)
      .digest('base64');

    if (signature === `v1=${currentSignature}`) {
      return next();
    }

    // Try next signing key if available
    if (nextSigningKey) {
      const nextSignature = createHmac('sha256', nextSigningKey)
        .update(payload)
        .digest('base64');

      if (signature === `v1=${nextSignature}`) {
        return next();
      }
    }

    logger.warn('Invalid QStash signature', { 
      receivedSignature: signature,
      timestamp 
    });

    return res.status(401).json({ 
      success: false, 
      error: 'Invalid QStash signature' 
    });

  } catch (error) {
    logger.error('QStash signature verification failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Signature verification failed' 
    });
  }
};