import { GoogleGenAI } from '@google/genai';

// Note: In production, this should be handled via a backend proxy
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';
const genAI = new GoogleGenAI({ apiKey: API_KEY });

function parseApiError(error: any): string {
  const message = error?.message || '';

  // Content filtering policy error
  if (message.includes('content filtering policy') || message.includes('blocked')) {
    return 'Your request was blocked by content policy. Please try a different prompt that avoids sensitive content.';
  }

  // Rate limiting
  if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
    return 'API rate limit exceeded. Please wait a moment and try again.';
  }

  // Invalid API key
  if (message.includes('401') || message.includes('API key') || message.includes('unauthorized')) {
    return 'Invalid API key. Please check your VITE_GEMINI_API_KEY in .env file.';
  }

  // Network error
  if (message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  return message || 'An unexpected error occurred. Please try again.';
}

export interface GenerationRequest {
  prompt: string;
  referenceImages?: string[]; // base64 array
  temperature?: number;
  seed?: number;
}

export interface EditRequest {
  instruction: string;
  originalImage: string; // base64
  referenceImages?: string[]; // base64 array
  maskImage?: string; // base64
  temperature?: number;
  seed?: number;
}

export interface SegmentationRequest {
  image: string; // base64
  query: string; // "the object at pixel (x,y)" or "the red car"
}

export class GeminiService {
  async generateImage(request: GenerationRequest): Promise<string[]> {
    try {
      const contents: any[] = [{ text: request.prompt }];
      
      // Add reference images if provided
      if (request.referenceImages && request.referenceImages.length > 0) {
        request.referenceImages.forEach(image => {
          contents.push({
            inlineData: {
              mimeType: "image/png",
              data: image,
            },
          });
        });
      }

      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents,
      });

      const images: string[] = [];
      const candidates = response?.candidates;

      if (!candidates || candidates.length === 0) {
        throw new Error('No response from model');
      }

      const parts = candidates[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            images.push(part.inlineData.data);
          }
        }
      }

      if (images.length === 0) {
        throw new Error('No image generated');
      }

      return images;
    } catch (error: any) {
      console.error('Error generating image:', error);
      throw new Error(parseApiError(error));
    }
  }

  async editImage(request: EditRequest): Promise<string[]> {
    try {
      const contents = [
        { text: this.buildEditPrompt(request) },
        {
          inlineData: {
            mimeType: "image/png",
            data: request.originalImage,
          },
        },
      ];

      // Add reference images if provided
      if (request.referenceImages && request.referenceImages.length > 0) {
        request.referenceImages.forEach(image => {
          contents.push({
            inlineData: {
              mimeType: "image/png",
              data: image,
            },
          });
        });
      }

      if (request.maskImage) {
        contents.push({
          inlineData: {
            mimeType: "image/png",
            data: request.maskImage,
          },
        });
      }

      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents,
      });

      const images: string[] = [];
      const candidates = response?.candidates;

      if (!candidates || candidates.length === 0) {
        throw new Error('No response from model');
      }

      const parts = candidates[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            images.push(part.inlineData.data);
          }
        }
      }

      if (images.length === 0) {
        throw new Error('No image generated');
      }

      return images;
    } catch (error: any) {
      console.error('Error editing image:', error);
      throw new Error(parseApiError(error));
    }
  }

  async segmentImage(request: SegmentationRequest): Promise<any> {
    try {
      const prompt = [
        { text: `Analyze this image and create a segmentation mask for: ${request.query}

Return a JSON object with this exact structure:
{
  "masks": [
    {
      "label": "description of the segmented object",
      "box_2d": [x, y, width, height],
      "mask": "base64-encoded binary mask image"
    }
  ]
}

Only segment the specific object or region requested. The mask should be a binary PNG where white pixels (255) indicate the selected region and black pixels (0) indicate the background.` },
        {
          inlineData: {
            mimeType: "image/png",
            data: request.image,
          },
        },
      ];

      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
      });

      const candidates = response?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No response from model');
      }

      const responseText = candidates[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error('No segmentation result');
      }

      return JSON.parse(responseText);
    } catch (error: any) {
      console.error('Error segmenting image:', error);
      throw new Error(parseApiError(error));
    }
  }

  private buildEditPrompt(request: EditRequest): string {
    const maskInstruction = request.maskImage 
      ? "\n\nIMPORTANT: Apply changes ONLY where the mask image shows white pixels (value 255). Leave all other areas completely unchanged. Respect the mask boundaries precisely and maintain seamless blending at the edges."
      : "";

    return `Edit this image according to the following instruction: ${request.instruction}

Maintain the original image's lighting, perspective, and overall composition. Make the changes look natural and seamlessly integrated.${maskInstruction}

Preserve image quality and ensure the edit looks professional and realistic.`;
  }
}

export const geminiService = new GeminiService();