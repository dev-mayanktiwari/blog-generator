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
  async ({ videoURL, length, tone }) => {
    const response = await ai.generate({
      prompt: [
        { text: generateYoutubeVideoBlogPrompt(length, tone) },
        { media: { url: videoURL, contentType: "video/mp4" } },
      ],
      output: {
        schema: summarizeTranscriptSchema,
      },
    });

    // console.log("Raw AI response for YouTube video summary:");
    // console.log("Raw AI output for YouTube video summary:", response.output);
    return {
      summary: response.output?.summary ?? "",
    };
  }
);
