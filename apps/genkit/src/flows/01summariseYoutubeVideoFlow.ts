import { logger } from "@workspace/utils";
import { generateYoutubeVideoBlogPrompt } from "../prompts";
import ai from "../services/ai";
import {
  summarizeTranscriptSchema,
  summarizeYoutubeVideoSchema,
  TSummaryLengthSchema,
} from "@workspace/types";

// export async function summariseTranscriptFlow(
//   videoURL: string,
//   length: TSummaryLengthSchema
// ) {
//   const response = await ai.generate({
//     prompt: [
//       { text: summarizeYoutubeVideoPrompt(length) },
//       { media: { url: videoURL, contentType: "video/mp4" } },
//     ],
//     output: {
//       schema: summarizeTranscriptSchema,
//     },
//   });

//   return response;
// }

export const summariseYoutubeVideoFlow = ai.defineFlow(
  {
    name: "summariseYoutubeVideoFlow",
    inputSchema: summarizeYoutubeVideoSchema,
    outputSchema: summarizeTranscriptSchema,
  },
  async ({ videoURL, length, tone, contentType, additionalPrompt }) => {
    const response = await ai.generate({
      prompt: [
        {
          text: generateYoutubeVideoBlogPrompt(
            length,
            tone,
            contentType,
            additionalPrompt
          ),
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
