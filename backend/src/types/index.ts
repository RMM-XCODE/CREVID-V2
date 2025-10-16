export interface ContentGenerationRequest {
  mode: 'topic' | 'reference';
  input: string;
  presets?: string;
}

export interface MediaGenerationRequest {
  content_id: string;
  scene_ids: number[];
  media_type: 'image' | 'video';
  presets?: string;
}

export interface TTSGenerationRequest {
  content_id: string;
  script: string;
  voice_settings?: {
    voice: string;
    stability: number;
    similarityBoost: number;
    style: number;
    speed: number;
    timestamps: boolean;
    languageCode: string;
  };
}

export interface BatchOperationRequest {
  content_id: string;
  operations: ('media' | 'tts')[];
  presets?: {
    media?: string;
    tts?: any;
  };
}

export interface JobResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimated_time?: string;
  progress?: number;
  result_data?: any;
  error_message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GoFileUploadResponse {
  filename: string;
  url: string;
  size: number;
  folder_id: string;
}

export interface OpenAIGenerationResponse {
  title: string;
  description: string;
  script?: string;
  scenes: Array<{
    id: number;
    text: string;
    mediaPrompt: string;
  }>;
}

export interface AppSettings {
  openaiApiKey?: string;
  openaiModel: string;
  openaiMaxTokens: number;
  openaiTemperature: number;
  gofileToken?: string;
  gofileRootFolder: string;
  qstashToken?: string;
  qstashCurrentSigningKey?: string;
  qstashNextSigningKey?: string;
  rateLimitPerHour: number;
  maxConcurrentJobs: number;
  jobTimeoutMinutes: number;
  jobRetryAttempts: number;
}