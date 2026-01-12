
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateMarketingCopy = async (params: {
  storeName: string;
  businessType: string;
  event: string;
  tone: string;
  lang: 'ar' | 'en';
}) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Write a professional marketing caption for social media.
  Store Name: ${params.storeName}
  Business Category: ${params.businessType}
  Event/Occasion: ${params.event}
  Tone: ${params.tone}
  Language: ${params.lang === 'ar' ? 'Arabic' : 'English'}
  Include hashtags and a clear call to action. Return only the text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateMarketingImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};

export const generateMarketingVideo = async (prompt: string) => {
  // Ensure the user has selected their key if needed (standard for Veo)
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (downloadLink) {
    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  return '';
};
