import { logger } from "@workspace/utils";
import { summarizeTranscriptSchema } from "@workspace/types";
import { generateImagePrompt } from "../prompts";
import { imageAi } from "../services/ai";
import ai from "../services/ai";
import vertexAI from "@genkit-ai/vertexai";

export const imagenImageGenerationFlow = imageAi.defineFlow(
  {
    name: "imageGenerationFlow",
    inputSchema: summarizeTranscriptSchema,
  },
  async ({ summary }) => {
    logger.info("Starting image generation flow", {
      meta: {
        summaryLength: summary.length,
        hasSummary: !!summary,
      },
    });

    try {
      const prompt = generateImagePrompt(summary);
      logger.info("Generated image prompt", {
        meta: {
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 200) + "...",
        },
      });

      // Try Vertex AI first
      try {
        const { media, text } = await imageAi.generate({
          prompt: prompt,
          output: { format: "media" },
        });

        logger.info("Image generation completed with Vertex AI", {
          meta: {
            hasMedia: !!media,
            hasText: !!text,
            textLength: text?.length || 0,
          },
        });

        if (media) {
          return media;
        }
      } catch (vertexError: any) {
        logger.warn("Vertex AI image generation failed, trying fallback", {
          meta: {
            error: vertexError.message,
          },
        });
      }

      // Fallback: Try with regular Gemini (though it may not support image generation)
      try {
        const { media, text } = await ai.generate({
          prompt: `Generate a simple ASCII art representation for this blog topic: ${summary.substring(0, 100)}...`,
          output: { format: "text" },
        });

        logger.info("Fallback text generation completed", {
          meta: {
            hasText: !!text,
            textLength: text?.length || 0,
          },
        });

        // Return a placeholder since we can't generate images with regular Gemini
        return null;
      } catch (fallbackError: any) {
        logger.error("Fallback generation also failed", {
          meta: {
            error: fallbackError.message,
          },
        });
      }

      return null;
    } catch (error: any) {
      logger.error("Error during image generation flow", {
        meta: {
          error: error.message,
          stack: error.stack,
          name: error.name,
        },
      });

      // Return null instead of throwing to prevent flow failure
      return null;
    }
  }
);
