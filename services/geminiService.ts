
import { GoogleGenAI, Type } from "@google/genai";

export const getMaintenanceAdvice = async (taskDescription: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("The API_KEY environment variable is missing. Please configure it in your Vercel project settings.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Proporciona una lista breve de pasos de seguridad y herramientas necesarias para esta tarea de mantenimiento de infraestructura aduanera: "${taskDescription}". Responde en español y formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tools: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["steps", "tools"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
