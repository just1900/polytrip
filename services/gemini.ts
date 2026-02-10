import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a background image for a specific game zone using Gemini 2.5 Flash Image.
 */
export const generateZoneBackground = async (zone: string): Promise<string | null> => {
  // We are moving to a seamless 3D map, so these might be used as textures or UI elements instead of full backdrops
  return null; 
};

/**
 * Generates a concept sketch for the game level.
 * Uses gemini-2.5-flash-image as the default recommended model for general image generation.
 */
export const generateConceptSketch = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A high quality 3D render of a cute isometric board game. The map is a floating island chain. Zones: Candy City, Crystal Tunnel, Snowy Peaks, Rainbow Bridge. Soft lighting, claymorphism style, pastel colors. The path is made of rounded square tiles.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate concept sketch:", error);
    return null;
  }
};

/**
 * Generates a short story segment based on the current location.
 */
export const generateStorySegment = async (zone: string, tileIndex: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the narrator of a cute 3D isometric board game.
      The player is at tile ${tileIndex} in the ${zone}.
      Generate a 1-sentence whimsical event description.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "Adventure awaits!";
  } catch (error) {
    console.error("Story generation failed", error);
    return "The journey continues...";
  }
};