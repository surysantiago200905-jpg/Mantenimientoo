
import { GoogleGenAI, Type } from "@google/genai";

// Standard way to access the key, ensuring we don't crash if it's undefined initially
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY no encontrada. Asegúrate de configurarla en las variables de entorno de Vercel.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMaintenanceAdvice = async (taskDescription: string) => {
  try {
    const ai = getAIClient();
    if (!ai) return null;

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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
