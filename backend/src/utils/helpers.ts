import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const generateId = (): string => {
  return uuidv4();
};

export const encrypt = (text: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from((process.env.ENCRYPTION_KEY || 'mock-32-character-encryption-key').slice(0, 32), 'utf8');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from((process.env.ENCRYPTION_KEY || 'mock-32-character-encryption-key').slice(0, 32), 'utf8');
    
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
      return encryptedText; // Return original if format is invalid
    }
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encrypted = textParts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Return original text if decryption fails
    return encryptedText;
  }
};

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const estimateProcessingTime = (type: string, complexity: number = 1): string => {
  const baseTimes = {
    content_generation: 30, // seconds
    media_generation: 120, // seconds per scene
    tts_generation: 60, // seconds
    batch_operation: 300, // seconds
  };
  
  const estimatedSeconds = (baseTimes[type as keyof typeof baseTimes] || 60) * complexity;
  const minutes = Math.ceil(estimatedSeconds / 60);
  
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;
  
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''}`;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  
  throw lastError!;
};