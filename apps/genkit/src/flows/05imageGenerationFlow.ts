import { logger } from "@workspace/utils";
import { summarizeTranscriptSchema } from "@workspace/types";
import { generateImagePrompt } from "../prompts";
import ai from "../services/ai";
import { googleAI } from "@genkit-ai/googleai";

export const imagenImageGenerationFlow = ai.defineFlow(
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
          prompt: prompt,
          promptLength: prompt.length,
          promptPreview: prompt.substring(0, 200) + "...",
        },
      });

      try {
        const { media, text } = await ai.generate({
          model: googleAI.model("gemini-2.0-flash-preview-image-generation"),
          prompt: prompt,
          config: {
            responseModalities: ["TEXT", "IMAGE"],
          },
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
