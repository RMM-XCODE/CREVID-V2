import { Request, Response } from 'express';
import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { encrypt, decrypt } from '@/utils/helpers';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { ApiResponse, AppSettings } from '@/types';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, 'default'))
    .limit(1);

  if (!settings[0]) {
    throw createError('Settings not found', 404);
  }

  const settingsData = settings[0];

  // Don't expose sensitive data, just indicate if they're set
  const response: ApiResponse<AppSettings> = {
    success: true,
    data: {
      openaiApiKey: settingsData.openaiApiKey ? '***configured***' : undefined,
      openaiModel: settingsData.openaiModel || 'gpt-4',
      openaiMaxTokens: settingsData.openaiMaxTokens || 2000,
      openaiTemperature: settingsData.openaiTemperature || 0.7,
      gofileToken: settingsData.gofileToken ? '***configured***' : undefined,
      gofileRootFolder: settingsData.gofileRootFolder || 'CREVID_Content',
      qstashToken: settingsData.qstashToken ? '***configured***' : undefined,
      qstashCurrentSigningKey: settingsData.qstashCurrentSigningKey ? '***configured***' : undefined,
      qstashNextSigningKey: settingsData.qstashNextSigningKey ? '***configured***' : undefined,
      rateLimitPerHour: settingsData.rateLimitPerHour || 100,
      maxConcurrentJobs: settingsData.maxConcurrentJobs || 5,
      jobTimeoutMinutes: settingsData.jobTimeoutMinutes || 10,
      jobRetryAttempts: settingsData.jobRetryAttempts || 3
    }
  };

  res.json(response);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const {
    openaiApiKey,
    openaiModel,
    openaiMaxTokens,
    openaiTemperature,
    gofileToken,
    gofileRootFolder,
    qstashToken,
    qstashCurrentSigningKey,
    qstashNextSigningKey,
    rateLimitPerHour,
    maxConcurrentJobs,
    jobTimeoutMinutes,
    jobRetryAttempts
  } = req.body;

  // Validate numeric values
  if (openaiMaxTokens && (openaiMaxTokens < 1 || openaiMaxTokens > 8000)) {
    throw createError('OpenAI max tokens must be between 1 and 8000', 400);
  }

  if (openaiTemperature && (openaiTemperature < 0 || openaiTemperature > 2)) {
    throw createError('OpenAI temperature must be between 0 and 2', 400);
  }

  if (rateLimitPerHour && rateLimitPerHour < 1) {
    throw createError('Rate limit must be at least 1 request per hour', 400);
  }

  if (maxConcurrentJobs && maxConcurrentJobs < 1) {
    throw createError('Max concurrent jobs must be at least 1', 400);
  }

  // Prepare update data
  const updateData: any = {
    updatedAt: new Date().toISOString()
  };

  // Only update provided fields
  if (openaiApiKey !== undefined) {
    updateData.openaiApiKey = openaiApiKey ? encrypt(openaiApiKey) : null;
  }
  if (openaiModel !== undefined) {
    updateData.openaiModel = openaiModel;
  }
  if (openaiMaxTokens !== undefined) {
    updateData.openaiMaxTokens = openaiMaxTokens;
  }
  if (openaiTemperature !== undefined) {
    updateData.openaiTemperature = openaiTemperature;
  }
  if (gofileToken !== undefined) {
    updateData.gofileToken = gofileToken ? encrypt(gofileToken) : null;
  }
  if (gofileRootFolder !== undefined) {
    updateData.gofileRootFolder = gofileRootFolder;
  }
  if (qstashToken !== undefined) {
    updateData.qstashToken = qstashToken ? encrypt(qstashToken) : null;
  }
  if (qstashCurrentSigningKey !== undefined) {
    updateData.qstashCurrentSigningKey = qstashCurrentSigningKey ? encrypt(qstashCurrentSigningKey) : null;
  }
  if (qstashNextSigningKey !== undefined) {
    updateData.qstashNextSigningKey = qstashNextSigningKey ? encrypt(qstashNextSigningKey) : null;
  }
  if (rateLimitPerHour !== undefined) {
    updateData.rateLimitPerHour = rateLimitPerHour;
  }
  if (maxConcurrentJobs !== undefined) {
    updateData.maxConcurrentJobs = maxConcurrentJobs;
  }
  if (jobTimeoutMinutes !== undefined) {
    updateData.jobTimeoutMinutes = jobTimeoutMinutes;
  }
  if (jobRetryAttempts !== undefined) {
    updateData.jobRetryAttempts = jobRetryAttempts;
  }

  // Update settings
  const updatedSettings = await db
    .update(appSettings)
    .set(updateData)
    .where(eq(appSettings.id, 'default'))
    .returning();

  if (!updatedSettings[0]) {
    throw createError('Failed to update settings', 500);
  }

  logger.info('Settings updated', { 
    updatedFields: Object.keys(updateData).filter(key => key !== 'updatedAt')
  });

  const response: ApiResponse = {
    success: true,
    message: 'Settings updated successfully'
  };

  res.json(response);
});

export const resetSettings = asyncHandler(async (req: Request, res: Response) => {
  // Reset to default values
  const defaultSettings = {
    openaiApiKey: process.env.OPENAI_API_KEY ? encrypt(process.env.OPENAI_API_KEY) : null,
    openaiModel: 'gpt-4',
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
    updatedAt: new Date().toISOString()
  };

  await db
    .update(appSettings)
    .set(defaultSettings)
    .where(eq(appSettings.id, 'default'));

  logger.info('Settings reset to defaults');

  const response: ApiResponse = {
    success: true,
    message: 'Settings reset to defaults'
  };

  res.json(response);
});

export const getSystemStatus = asyncHandler(async (req: Request, res: Response) => {
  // Check system health
  const settings = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, 'default'))
    .limit(1);

  const systemStatus = {
    database: 'connected',
    openai: settings[0]?.openaiApiKey ? 'configured' : 'not_configured',
    gofile: settings[0]?.gofileToken ? 'configured' : 'not_configured',
    qstash: settings[0]?.qstashToken ? 'configured' : 'not_configured',
    timestamp: new Date().toISOString()
  };

  const response: ApiResponse = {
    success: true,
    data: systemStatus
  };

  res.json(response);
});