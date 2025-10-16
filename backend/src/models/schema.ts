import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Content Management (Core)
export const contents = sqliteTable('contents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  script: text('script'),
  status: text('status', { enum: ['draft', 'completed', 'processing'] }).default('draft'),
  scenesCount: integer('scenes_count').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Job Management (QStash integration)
export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  contentId: text('content_id').references(() => contents.id, { onDelete: 'cascade' }),
  type: text('type', { 
    enum: ['content_generation', 'media_generation', 'tts_generation', 'batch_operation'] 
  }).notNull(),
  status: text('status', { 
    enum: ['queued', 'processing', 'completed', 'failed'] 
  }).default('queued'),
  qstashMessageId: text('qstash_message_id'),
  inputData: text('input_data', { mode: 'json' }),
  resultData: text('result_data', { mode: 'json' }),
  errorMessage: text('error_message'),
  progress: integer('progress').default(0),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Files (GoFile links)
export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  contentId: text('content_id').references(() => contents.id, { onDelete: 'cascade' }),
  jobId: text('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  type: text('type', { enum: ['image', 'video', 'audio'] }).notNull(),
  filename: text('filename').notNull(),
  gofileUrl: text('gofile_url').notNull(),
  sceneId: integer('scene_id'),
  fileSize: integer('file_size'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// GoFile Folders
export const gofileFolders = sqliteTable('gofile_folders', {
  id: text('id').primaryKey(),
  contentId: text('content_id').references(() => contents.id, { onDelete: 'cascade' }),
  jobId: text('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  folderId: text('folder_id').notNull(),
  folderUrl: text('folder_url').notNull(),
  folderName: text('folder_name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// App Settings (Enhanced)
export const appSettings = sqliteTable('app_settings', {
  id: text('id').primaryKey(),
  // OpenAI Config
  openaiApiKey: text('openai_api_key'),
  openaiModel: text('openai_model').default('gpt-4o'),
  openaiMaxTokens: integer('openai_max_tokens').default(2000),
  openaiTemperature: real('openai_temperature').default(0.7),
  // GoFile Config
  gofileToken: text('gofile_token'),
  gofileRootFolder: text('gofile_root_folder').default('CREVID_Content'),
  // QStash Config
  qstashToken: text('qstash_token'),
  qstashCurrentSigningKey: text('qstash_current_signing_key'),
  qstashNextSigningKey: text('qstash_next_signing_key'),
  // Rate Limiting
  rateLimitPerHour: integer('rate_limit_per_hour').default(100),
  maxConcurrentJobs: integer('max_concurrent_jobs').default(5),
  // Job Settings
  jobTimeoutMinutes: integer('job_timeout_minutes').default(10),
  jobRetryAttempts: integer('job_retry_attempts').default(3),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Request Logs (for rate limiting & metrics)
export const requestLogs = sqliteTable('request_logs', {
  id: text('id').primaryKey(),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent'),
  requestBody: text('request_body', { mode: 'json' }),
  responseStatus: integer('response_status').notNull(),
  responseTimeMs: integer('response_time_ms').notNull(),
  errorMessage: text('error_message'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});