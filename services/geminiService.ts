
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Deep Thinking Mode using gemini-3-pro-preview for complex reasoning
  static async complexQuery(prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    // Property access .text is correct; do not call .text()
    return response.text;
  }

  // Fast Response Mode using gemini-3-flash-preview for basic tasks
  static async fastQuery(prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  }

  // Google Search Grounding for recent/trending information
  static async searchWithGrounding(prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response;
  }

  // Image Understanding using gemini-3-pro-preview
  static async analyzeImage(base64: string, prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt || "Analyze this camera gear in detail." }
        ]
      }
    });
    return response.text;
  }

  // Video Understanding
  static async analyzeVideo(base64: string, prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64.split(',')[1], mimeType: 'video/mp4' } },
          { text: prompt || "What is happening in this video clip?" }
        ]
      }
    });
    return response.text;
  }

  // Audio Transcription using gemini-3-flash-preview
  static async transcribeAudio(base64Pcm: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Pcm, mimeType: 'audio/wav' } },
          { text: "Transcribe this audio accurately." }
        ]
      }
    });
    return response.text;
  }

  // Image Generation with gemini-3-pro-image-preview
  static async generateImage(prompt: string, aspectRatio: string, size: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size as any
        }
      }
    });
    // Iterate through candidates and parts to find the image part
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
  }

  // Video Generation using Veo 3 models
  static async generateVideoFromPrompt(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key to the download URL for MP4 bytes
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  // Image editing using gemini-2.5-flash-image (Nano Flash series)
  static async editImage(base64: string, prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
  }
}
