import { Request, Response, NextFunction } from 'express';
import { db } from '@/config/database';
import { requestLogs, appSettings } from '@/models/schema';
import { eq, and, gte } from 'drizzle-orm';
import { logger } from '@/utils/logger';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
}

export const createRateLimiter = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 60 * 60 * 1000, // 1 hour
    keyGenerator = (req: Request) => req.ip || 'unknown'
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const now = new Date();
      const windowStart = new Date(now.getTime() - windowMs);

      // Get current rate limit from settings
      const settings = await db.select().from(appSettings).where(eq(appSettings.id, 'default')).limit(1);
      const maxRequests = settings[0]?.rateLimitPerHour || 100;

      // Count requests in the current window
      const recentRequests = await db
        .select()
        .from(requestLogs)
        .where(
          and(
            eq(requestLogs.ipAddress, key),
            gte(requestLogs.createdAt, windowStart.toISOString())
          )
        );

      if (recentRequests.length >= maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${key}`);
        res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Maximum ${maxRequests} requests per hour allowed`,
          retryAfter: Math.ceil(windowMs / 1000)
        });
        return;
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - recentRequests.length - 1).toString(),
        'X-RateLimit-Reset': new Date(now.getTime() + windowMs).toISOString()
      });

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      next(); // Continue on error to avoid blocking requests
    }
  };
};

// Default rate limiter instance
export const rateLimiter = createRateLimiter();