import { logger } from "@workspace/utils";
import { generateYoutubeVideoBlogPrompt } from "../prompts";
import ai from "../services/ai";
import {
  summarizeTranscriptSchema,
  summarizeYoutubeVideoSchema,
  TSummaryLengthSchema,
} from "@workspace/types";

export const summariseYoutubeVideoFlow = ai.defineFlow(
  {
    name: "summariseYoutubeVideoFlow",
    inputSchema: summarizeYoutubeVideoSchema,
    outputSchema: summarizeTranscriptSchema,
  },
  async ({ videoURL, length, tone, contentType, additionalPrompt }) => {
    const prompt = generateYoutubeVideoBlogPrompt(
      length,
      tone,
      contentType,
      additionalPrompt
    );
    const response = await ai.generate({
      prompt: [
        {
          text: prompt,
        },
        { media: { url: videoURL, contentType: "video/mp4" } },
      ],
      output: {
        schema: summarizeTranscriptSchema,
      },
    });

    logger.info("Flow One - Summary generated successfully.", {
      meta: {
        summary: response.output?.summary,
      },
    });

    return {
      summary: response.output?.summary ?? "",
    };
  }
);
