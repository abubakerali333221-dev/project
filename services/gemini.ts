
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Fix: Obtaining API key exclusively from process.env.API_KEY
// Fix: Use 'gemini-3-flash-preview' for general text tasks and 'gemini-2.5-flash-image' for images.

export const generateMarketingCopy = async (params: {
  storeName: string;
  businessType: string;
  event: string;
  tone: string;
  lang: 'ar' | 'en';
}) => {
  // Fix: Create instance right before API call to ensure it uses the latest key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

  // Fix: Directly accessing .text property (not a method)
  return response.text;
};

export const generateMarketingImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  // Fix: Iterate through all parts to find the image inlineData
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};

export const generateMarketingVideo = async (prompt: string) => {
  // Fix: Mandatory API key selection check for Veo models
  // @ts-ignore - Assuming window.aistudio is available in the environment
  if (!(await window.aistudio.hasSelectedApiKey())) {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Guideline: Proceed immediately after triggering openSelectKey()
  }

  // Fix: Always re-instantiate GoogleGenAI to pick up the updated key from selected dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (downloadLink) {
    // Fix: Appending API key for MP4 bytes retrieval
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  return '';
};
