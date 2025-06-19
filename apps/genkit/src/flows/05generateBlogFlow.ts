import {
  finalPostSchema,
  summarizeYoutubeVideoSchema,
  TGenerateBlogSchema,
} from "@workspace/types";
import ai from "../services/ai";
import { summariseYoutubeVideoFlow } from "./01summariseYoutubeVideoFlow";
import { generateSearchTermsFlow } from "./02generateSearchTerms";
import { getSearchTermResults } from "./03getSearchTermResults";
import { generateSummaryFlow } from "./04generateFinalSummaryFlow";
import { fetchSearchTermDetailsTool } from "../tools/fetchSearchTermDetails";

export const generateBlogFlow = ai.defineFlow(
  {
    name: "generateFullBlogFinalFlow",
    inputSchema: summarizeYoutubeVideoSchema,
  },
  async ({ videoURL, length, tone }) => {
    const summary = await summariseYoutubeVideoFlow({ videoURL, length, tone });
    const searchTerms = await generateSearchTermsFlow(summary);
    const searchTermsResults = await getSearchTermResults(searchTerms);
    const generateSummaryPayload: TGenerateBlogSchema = {
      summary: summary.summary,
      searchTerms: searchTerms.searchTerms,
      // @ts-ignore
      searchTermResults: searchTermsResults,
      length: length,
      tone: tone,
    };
    const post = await generateSummaryFlow(generateSummaryPayload);
    console.log("Generated blog post:", post);
    return {
      summary,
      searchTerms,
      searchTermsResults,
      post: {
        title: post.title,
        content: post.content,
      },
    };
  }
);
