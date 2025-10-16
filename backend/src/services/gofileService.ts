import axios from 'axios';
import FormData from 'form-data';
import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { retryWithBackoff, sanitizeFilename } from '@/utils/helpers';
import { GoFileUploadResponse } from '@/types';

class GoFileService {
  private baseUrl = 'https://store1.gofile.io';

  private async getToken(): Promise<string> {
    const settings = await db.select().from(appSettings).where(eq(appSettings.id, 'default')).limit(1);
    const token = settings[0]?.gofileToken || process.env.GOFILE_API_TOKEN;

    if (!token || token.includes('mock')) {
      throw new Error('GoFile API token not configured');
    }

    return token;
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<{
    folderId: string;
    folderUrl: string;
    folderName: string;
  }> {
    return retryWithBackoff(async () => {
      const token = await this.getToken();
      const sanitizedName = sanitizeFilename(folderName);

      logger.info('Creating GoFile folder', { folderName: sanitizedName, parentFolderId });

      const response = await axios.post(`${this.baseUrl}/createFolder`, {
        folderName: sanitizedName,
        parentFolderId: parentFolderId || 'root'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status !== 'ok') {
        throw new Error(`GoFile folder creation failed: ${response.data.status}`);
      }

      const folderId = response.data.data.id;
      return {
        folderId,
        folderUrl: `https://gofile.io/d/${folderId}`,
        folderName: sanitizedName
      };
    }, 3, 2000);
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    folderId: string,
    contentType: string = 'application/octet-stream'
  ): Promise<GoFileUploadResponse> {
    return retryWithBackoff(async () => {
      const token = await this.getToken();
      const sanitizedFilename = sanitizeFilename(filename);

      logger.info('Uploading file to GoFile', { filename: sanitizedFilename, folderId });

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: sanitizedFilename,
        contentType
      });
      formData.append('folderId', folderId);

      const response = await axios.post(`${this.baseUrl}/uploadFile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      if (response.data.status !== 'ok') {
        throw new Error(`GoFile upload failed: ${response.data.status}`);
      }

      const fileData = response.data.data;
      return {
        filename: sanitizedFilename,
        url: fileData.downloadPage,
        size: fileData.size,
        folder_id: folderId
      };
    }, 5, 1500);
  }

  async uploadFromUrl(
    fileUrl: string,
    filename: string,
    folderId: string
  ): Promise<GoFileUploadResponse> {
    return retryWithBackoff(async () => {
      logger.info('Downloading and uploading file from URL', { fileUrl, filename });

      // Download file from URL
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const fileBuffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'application/octet-stream';

      // Upload to GoFile
      return await this.uploadFile(fileBuffer, filename, folderId, contentType);
    }, 3, 2000);
  }

  async deleteFile(fileId: string): Promise<boolean> {
    return retryWithBackoff(async () => {
      const token = await this.getToken();

      logger.info('Deleting GoFile file', { fileId });

      const response = await axios.delete(`${this.baseUrl}/deleteContent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          contentId: fileId
        }
      });

      return response.data.status === 'ok';
    }, 2, 1000);
  }

  async getFolderContents(folderId: string): Promise<any> {
    return retryWithBackoff(async () => {
      const token = await this.getToken();

      const response = await axios.get(`${this.baseUrl}/getContent?contentId=${folderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status !== 'ok') {
        throw new Error(`Failed to get folder contents: ${response.data.status}`);
      }

      return response.data.data;
    }, 2, 1000);
  }

  // Mock implementation for development
  async mockUpload(filename: string, folderId: string): Promise<GoFileUploadResponse> {
    logger.info('Mock GoFile upload', { filename, folderId });
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      filename,
      url: `https://gofile.io/d/${folderId}/${filename}`,
      size: Math.floor(Math.random() * 1000000) + 100000, // Random size
      folder_id: folderId
    };
  }

  async mockCreateFolder(folderName: string): Promise<{
    folderId: string;
    folderUrl: string;
    folderName: string;
  }> {
    logger.info('Mock GoFile folder creation', { folderName });
    
    const folderId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sanitizedName = sanitizeFilename(folderName);
    
    return {
      folderId,
      folderUrl: `https://gofile.io/d/${folderId}`,
      folderName: sanitizedName
    };
  }
}

export const gofileService = new GoFileService();