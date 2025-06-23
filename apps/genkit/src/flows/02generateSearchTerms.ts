import { generateSearchTermsPrompt } from "../prompts";
import ai from "../services/ai";
import { searchTermsSchema, summarizeTranscriptSchema } from "@workspace/types";

// export async function generateSearchTerm(summary: string) {
//   const response = await ai.generate({
//     prompt: generateSearchTermsPrompt(summary),
//     output: {
//       schema: searchTermsSchema,
//     },
//   });

//   return response;
// }

export const generateSearchTermsFlow = ai.defineFlow(
  {
    name: "generateSearchTermsFlow",
    inputSchema: summarizeTranscriptSchema,
    outputSchema: searchTermsSchema,
  },
  async ({ summary }) => {
    const response = await ai.generate({
      prompt: generateSearchTermsPrompt(summary),
    });
    // // console.log(
    //   "Raw AI response for search terms from generate search terms:",
    //   response.text
    // );

    // console.log(
    //     "Raw AI output for search terms from generate search terms:",
    //     response.output
    //   );
    const parsed = response.output;
    // console.log("Parsed AI response for search terms:", parsed);
    // const parsed = response.text

    // console.log("Parsed AI response for search terms:", parsed);

    if (!parsed.searchTerms || !Array.isArray(parsed.searchTerms)) {
      throw new Error(
        "AI response does not contain valid 'searchTerms' array."
      );
    }

    return {
      searchTerms: parsed.searchTerms,
    };
  }
);
