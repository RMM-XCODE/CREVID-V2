// Content Types
export interface Content {
  id: string;
  title: string;
  description?: string;
  script?: string;
  status: 'draft' | 'completed' | 'processing';
  scenesCount?: number;
  scenes?: number;
  hasMedia?: boolean;
  hasAudio?: boolean;
  createdAt: string;
  updatedAt?: string;
  goFileFolder?: {
    folderId: string;
    folderUrl: string;
    folderName: string;
  };
}

// Job Types
export interface Job {
  id: string;
  contentId?: string;
  type: 'content_generation' | 'media_generation' | 'tts_generation' | 'batch_operation';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  qstashMessageId?: string;
  inputData?: any;
  resultData?: any;
  errorMessage?: string;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  job_id?: string;
  created_at?: string;
}

// Settings Types
export interface AppSettings {
  openaiApiKey?: string;
  openaiModel?: string;
  openaiMaxTokens?: number;
  openaiTemperature?: number;
  gofileToken?: string;
  gofileRootFolder?: string;
  qstashToken?: string;
  qstashCurrentSigningKey?: string;
  qstashNextSigningKey?: string;
  rateLimitPerHour?: number;
  maxConcurrentJobs?: number;
  jobTimeoutMinutes?: number;
  jobRetryAttempts?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Scene Types
export interface Scene {
  id: number;
  text: string;
  mediaPrompt: string;
}

// Generated Content Types
export interface GeneratedContent {
  title: string;
  description: string;
  scenes: Scene[];
}