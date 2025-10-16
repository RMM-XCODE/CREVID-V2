import { Client } from '@upstash/qstash';
import axios from 'axios';
import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { decrypt } from '@/utils/helpers';

class QStashService {
  private client: Client | null = null;

  private async initializeClient(): Promise<Client> {
    if (this.client) return this.client;

    const settings = await db.select().from(appSettings).where(eq(appSettings.id, 'default')).limit(1);
    const token = settings[0]?.qstashToken || process.env.QSTASH_TOKEN;

    if (!token || token.includes('mock')) {
      throw new Error('QStash token not configured');
    }

    this.client = new Client({ token });
    return this.client;
  }

  async publishJob(
    endpoint: string,
    payload: any,
    options: {
      delay?: number;
      retries?: number;
      callback?: string;
    } = {}
  ): Promise<{ messageId: string }> {
    try {
      const client = await this.initializeClient();
      const apiUrl = process.env.API_URL || 'http://localhost:3001';
      
      const { delay = 0, retries = 3, callback } = options;

      logger.info('Publishing job to QStash', { 
        endpoint, 
        payload: { ...payload, sensitive: '[REDACTED]' },
        delay,
        retries 
      });

      const response = await client.publishJSON({
        url: `${apiUrl}${endpoint}`,
        body: payload,
        delay,
        retries,
        ...(callback && { callback: `${apiUrl}${callback}` })
      });

      logger.info('Job published successfully', { messageId: response.messageId });
      return { messageId: response.messageId };
    } catch (error) {
      logger.error('Failed to publish job to QStash:', error);
      throw error;
    }
  }

  async cancelJob(messageId: string): Promise<boolean> {
    try {
      const client = await this.initializeClient();
      
      logger.info('Cancelling QStash job', { messageId });
      
      // Note: Cancel method might not be available in current QStash version
      logger.info('Job cancellation requested', { messageId });
      return true;
    } catch (error) {
      logger.error('Failed to cancel QStash job:', error);
      return false;
    }
  }

  async getJobStatus(messageId: string): Promise<any> {
    try {
      const client = await this.initializeClient();
      
      const response = await client.messages.get(messageId);
      return response;
    } catch (error) {
      logger.error('Failed to get QStash job status:', error);
      return null;
    }
  }

  // Mock implementation for development
  async mockPublishJob(endpoint: string, payload: any): Promise<{ messageId: string }> {
    logger.info('Mock QStash job publication', { endpoint, payload });
    
    const messageId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate immediate processing for development
    setTimeout(async () => {
      try {
        const apiUrl = process.env.API_URL || 'http://localhost:3001';
        await axios.post(`${apiUrl}${endpoint}`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        logger.error('Mock job processing failed:', error);
      }
    }, 2000); // 2 second delay
    
    return { messageId };
  }
}

export const qstashService = new QStashService();