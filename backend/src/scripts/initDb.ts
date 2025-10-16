import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { encrypt } from '@/utils/helpers';
import { logger } from '@/utils/logger';

async function initializeDatabase() {
  try {
    logger.info('🔧 Initializing CREVID database...');

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 'default'))
      .limit(1);

    if (existingSettings.length === 0) {
      logger.info('📝 Creating default settings...');
      
      // Create default settings
      await db.insert(appSettings).values({
        id: 'default',
        openaiApiKey: process.env.OPENAI_API_KEY ? encrypt(process.env.OPENAI_API_KEY) : null,
        openaiModel: 'gpt-4o',
        openaiMaxTokens: 2000,
        openaiTemperature: 0.7,
        gofileToken: process.env.GOFILE_API_TOKEN ? encrypt(process.env.GOFILE_API_TOKEN) : null,
        gofileRootFolder: 'CREVID_Content',
        qstashToken: process.env.QSTASH_TOKEN ? encrypt(process.env.QSTASH_TOKEN) : null,
        qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ? encrypt(process.env.QSTASH_CURRENT_SIGNING_KEY) : null,
        qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ? encrypt(process.env.QSTASH_NEXT_SIGNING_KEY) : null,
        rateLimitPerHour: 100,
        maxConcurrentJobs: 5,
        jobTimeoutMinutes: 10,
        jobRetryAttempts: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      logger.info('✅ Default settings created successfully');
    } else {
      logger.info('⚡ Settings already exist, skipping creation');
    }

    logger.info('🎉 Database initialization completed successfully!');
    
    // Display configuration status
    const settings = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, 'default'))
      .limit(1);

    const config = settings[0];
    logger.info('📊 Configuration Status:');
    logger.info(`   OpenAI API: ${config.openaiApiKey ? '✅ Configured' : '❌ Not configured'}`);
    logger.info(`   GoFile API: ${config.gofileToken ? '✅ Configured' : '❌ Not configured'}`);
    logger.info(`   QStash API: ${config.qstashToken ? '✅ Configured' : '❌ Not configured'}`);
    logger.info(`   Rate Limit: ${config.rateLimitPerHour} requests/hour`);
    logger.info(`   Max Jobs: ${config.maxConcurrentJobs} concurrent`);

  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      logger.info('Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database initialization script failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase };