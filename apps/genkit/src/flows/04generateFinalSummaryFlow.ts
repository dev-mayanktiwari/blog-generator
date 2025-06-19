import {
  finalPostSchema,
  generateBlogSchema,
  TGenerateBlogSchema,
} from "@workspace/types";
import ai from "../services/ai";
import { generateBlogPrompt } from "../prompts";

export const generateSummaryFlow = ai.defineFlow(
  {
    name: "generateFinalSummaryUsingWebSearchResultsFlow",
    inputSchema: generateBlogSchema,
    outputSchema: finalPostSchema,
  },
  async (payload: TGenerateBlogSchema) => {
    console.log("Payload for generateSummaryFlow:", payload);
    const response = await ai.generate({
      prompt: generateBlogPrompt(payload),
      output: {
        schema: finalPostSchema,
      },
    });

    console.log(
      "Generated AI response text for summary is (from generate summary flow):",
      response.text
    );

    const parsed = response.output;

    console.log("Parsed AI response for summary:", parsed);

    if (!parsed?.title || !parsed?.content) {
      throw new Error(
        "AI response does not contain both 'title' and 'content'."
      );
    }

    return {
      title: parsed.title,
      content: parsed.content,
    };
  }
);
