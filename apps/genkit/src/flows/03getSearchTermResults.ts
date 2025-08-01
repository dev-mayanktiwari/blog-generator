import {
  searchTermResultSchema,
  searchTermsSchema,
  TSearchTermsSchema,
} from "@workspace/types";
import ai from "../services/ai";
import { fetchSearchTermDetailsTool } from "../tools/fetchSearchTermDetails";
import { generateSearchTermsResultsPrompt } from "../prompts";
import { logger } from "@workspace/utils";

// export async function getSearchTermResults(searchTerms: TSearchTermsSchema) {
//   // console.log("Search terms received in getSearchTermResults:", searchTerms);
//   const response = await ai.generate({
//     prompt: generateSearchTermsResultsPrompt(searchTerms),
//     tools: [fetchSearchTermDetailsTool],
//   });

//   // console.log(
//   //   "Generated AI response text for search term results (From get search terms results):",
//   //   response.output
//   // );
//   logger.info("Flow Three - Search Terms results fetched successfully.", {
//     meta: {
//       searchTermsResult: response.output,
//     },
//   });

//   return response.output;
// }

export const getSearchTermResultsFlow = ai.defineFlow(
  {
    name: "getSearchTermsResult",
    inputSchema: searchTermsSchema,
    outputSchema: searchTermResultSchema,
  },
  async ({ searchTerms }) => {
    const { output } = await ai.generate({
      prompt: generateSearchTermsResultsPrompt({ searchTerms }),
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // console.log("Hello");

    // console.log("Output from getSearchTermResultsFlow:", output);

    logger.info("Flow Three - Search Terms results fetched successfully.", {
      meta: {
        searchTermsResult: output,
      },
    });

    return output;
  }
);
