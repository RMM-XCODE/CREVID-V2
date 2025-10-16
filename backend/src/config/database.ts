import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/models/schema';
import { logger } from '@/utils/logger';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export const initializeDatabase = async () => {
  try {
    // Test connection
    await db.select().from(schema.appSettings).limit(1);
    logger.info('Database connection established successfully');
    
    // Initialize default settings if not exists
    const existingSettings = await db.select().from(schema.appSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(schema.appSettings).values({
        id: 'default',
        openaiApiKey: process.env.OPENAI_API_KEY,
        openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
        openaiMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
        openaiTemperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        gofileToken: process.env.GOFILE_API_TOKEN,
        gofileRootFolder: process.env.GOFILE_ROOT_FOLDER || 'CREVID_Content',
        qstashToken: process.env.QSTASH_TOKEN,
        qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
        qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
        rateLimitPerHour: parseInt(process.env.RATE_LIMIT_PER_HOUR || '100'),
        maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '5'),
        jobTimeoutMinutes: parseInt(process.env.JOB_TIMEOUT_MINUTES || '10'),
        jobRetryAttempts: parseInt(process.env.JOB_RETRY_ATTEMPTS || '3'),
      });
      logger.info('Default settings initialized');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};