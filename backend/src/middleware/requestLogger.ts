import { Request, Response, NextFunction } from 'express';
import { db } from '@/config/database';
import { requestLogs } from '@/models/schema';
import { generateId } from '@/utils/helpers';
import { logger } from '@/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(chunk?: any, encoding?: any): Response {
    const responseTime = Date.now() - startTime;
    
    // Log to database (async, don't wait)
    logRequest(req, res, responseTime).catch(error => {
      logger.error('Failed to log request to database:', error);
    });
    
    // Call original end function
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

const logRequest = async (req: Request, res: Response, responseTime: number) => {
  try {
    await db.insert(requestLogs).values({
      id: generateId(),
      endpoint: req.path,
      method: req.method,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || null,
      requestBody: req.method !== 'GET' ? req.body : null,
      responseStatus: res.statusCode,
      responseTimeMs: responseTime,
      errorMessage: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : null,
    });
  } catch (error) {
    logger.error('Failed to insert request log:', error);
  }
};