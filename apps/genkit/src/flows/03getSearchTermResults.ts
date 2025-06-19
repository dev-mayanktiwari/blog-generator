import { TSearchTermsSchema } from "@workspace/types";
import ai from "../services/ai";
import { fetchSearchTermDetailsTool } from "../tools/fetchSearchTermDetails";
import { generateSearchTermsResultsPrompt } from "../prompts";

export async function getSearchTermResults(searchTerms: TSearchTermsSchema) {
  console.log("Search terms received in getSearchTermResults:", searchTerms);
  const response = await ai.generate({
    prompt: generateSearchTermsResultsPrompt(searchTerms),
    tools: [fetchSearchTermDetailsTool],
  });

  console.log(
    "Generated AI response text for search term results (From get search terms results):",
    response.output
  );

  return response.output;
}

// export const getSearchTermResultsFlow = ai.defineFlow(
//   {
//     name: "getSearchTermResultsFlow",
//     inputSchema: searchTermsSchema,
//   },
//   async (payload) => {
//     const response = await getSearchTermResults(payload);

//     console.log(
//       "Generated AI response text for search term results (From get search terms results flow):",
//       response.text
//     );

//     return response;
//   }
// );
