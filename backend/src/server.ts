import dotenv from 'dotenv';
import { resolve } from 'path';
import moduleAlias from 'module-alias';

// Setup module aliases for both development and production
moduleAlias.addAlias('@', resolve(__dirname));

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

import app from './app';
import { logger } from '@/utils/logger';
import { initializeDatabase } from '@/config/database';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database
    logger.info('Initializing database...');
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 CREVID API Server running on port ${PORT}`);
      logger.info(`📖 API Documentation: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'development') {
        logger.info('🔧 Running in development mode');
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();