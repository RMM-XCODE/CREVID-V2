import OpenAI from 'openai';
import { db } from '@/config/database';
import { appSettings } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { retryWithBackoff, decrypt } from '@/utils/helpers';
import { OpenAIGenerationResponse, ContentGenerationRequest } from '@/types';

class OpenAIService {
  private openai: OpenAI | null = null;

  private async initializeClient(): Promise<OpenAI> {
    if (this.openai) return this.openai;

    const settings = await db.select().from(appSettings).where(eq(appSettings.id, 'default')).limit(1);
    let apiKey = settings[0]?.openaiApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('mock') || apiKey === 'NULL') {
      throw new Error('OpenAI API key not configured. Please set your API key in Settings.');
    }

    // Decrypt the API key if it's encrypted (from database)
    if (settings[0]?.openaiApiKey) {
      apiKey = decrypt(apiKey);
    }

    this.openai = new OpenAI({ apiKey });
    return this.openai;
  }

  async generateContent(request: ContentGenerationRequest): Promise<OpenAIGenerationResponse> {
    return retryWithBackoff(async () => {
      const client = await this.initializeClient();
      const settings = await db.select().from(appSettings).where(eq(appSettings.id, 'default')).limit(1);
      
      const config = settings[0] || {};
      const model = config.openaiModel || 'gpt-4';
      const maxTokens = config.openaiMaxTokens || 2000;
      const temperature = config.openaiTemperature || 0.7;

      const systemPrompt = this.buildSystemPrompt(request.presets);
      const userPrompt = this.buildUserPrompt(request);

      logger.info('Generating content with OpenAI', { 
        model, 
        maxTokens, 
        temperature,
        mode: request.mode 
      });

      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      try {
        const parsed = JSON.parse(content);
        return this.validateAndFormatResponse(parsed);
      } catch (error) {
        logger.error('Failed to parse OpenAI response:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }
    }, 3, 2000);
  }

  async generateMediaPrompt(sceneText: string, presets?: string): Promise<string> {
    return retryWithBackoff(async () => {
      const client = await this.initializeClient();
      
      const systemPrompt = `You are an expert at creating detailed visual prompts for AI image/video generation.
Create a detailed, specific prompt based on the scene text and style preferences.
Focus on visual elements, composition, lighting, and style.
Keep it concise but descriptive (max 200 characters).
${presets ? `\nStyle Guidelines: ${presets}` : ''}`;

      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a visual prompt for this scene: "${sceneText}"` }
        ],
        max_tokens: 150,
        temperature: 0.8
      });

      return completion.choices[0]?.message?.content || sceneText;
    }, 2, 1000);
  }

  private buildSystemPrompt(presets?: string): string {
    const basePrompt = `You are CREVID, an AI assistant specialized in creating engaging YouTube content.
Generate content following the S.O.C.I.A.L formula and RUANG TUMBUH guidelines.
Always respond with valid JSON in this exact format:
{
  "title": "Engaging YouTube title",
  "description": "Complete video description with hashtags",
  "scenes": [
    {
      "id": 1,
      "text": "Scene narration text",
      "mediaPrompt": "Visual description for this scene"
    }
  ]
}`;

    if (presets) {
      return `${basePrompt}\n\nAdditional Guidelines:\n${presets}`;
    }

    return basePrompt;
  }

  private buildUserPrompt(request: ContentGenerationRequest): string {
    if (request.mode === 'topic') {
      return `Create YouTube content about this topic: "${request.input}"
Generate 5-7 scenes following the S.O.C.I.A.L formula.
Make it engaging for Gen Z audience with RUANG TUMBUH style.`;
    } else {
      return `Create YouTube content based on this reference material: "${request.input}"
Analyze the content and create 5-7 scenes with unique perspective.
Make it engaging for Gen Z audience with RUANG TUMBUH style.`;
    }
  }

  private validateAndFormatResponse(parsed: any): OpenAIGenerationResponse {
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.scenes)) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Ensure scenes have required fields
    const scenes = parsed.scenes.map((scene: any, index: number) => ({
      id: scene.id || index + 1,
      text: scene.text || '',
      mediaPrompt: scene.mediaPrompt || scene.text || ''
    }));

    return {
      title: parsed.title,
      description: parsed.description,
      scenes
    };
  }
}

export const openaiService = new OpenAIService();