import { z } from "zod";

export const summaryToneSchema = z
  .enum(["formal", "informal", "neutral", "professional", "conversational"])
  .optional()
  .default("neutral")
  .describe("The tone of the summary.");

export const summaryLengthSchema = z
  .enum(["short", "medium", "long"])
  .optional()
  .default("medium")
  .describe("The length of the summary.");

export const summarizeTranscriptSchema = z.object({
  summary: z.string().describe("The summary of the video."),
});

export const summarizeYoutubeVideoSchema = z.object({
  videoURL: z
    .string()
    .url()
    .describe("The URL of the YouTube video to summarize."),
  length: z
    .enum(["short", "medium", "long"])
    .optional()
    .default("medium")
    .describe("The length of the summary."),
  tone: z
    .enum(["formal", "informal", "neutral", "professional", "conversational"])
    .optional()
    .default("neutral")
    .describe("The tone of the summary."),
});

export const searchTermsSchema = z.object({
  searchTerms: z
    .array(z.string())
    .length(3)
    .describe("The search terms generated from the summary."),
});

export const searchTermResultSchema = z.object({
  term1: z.string().describe("The first search term result."),
  term2: z.string().describe("The second search term result."),
  term3: z.string().describe("The third search term result."),
});

export const generateBlogSchema = z.object({
  summary: z.string().describe("The summary of the video."),
  searchTerms: z
    .array(z.string())
    .length(3)
    .describe("The search terms generated from the summary."),
  searchTermResults: z.object({
    term1: z.string().describe("The first search term result."),
    term2: z.string().describe("The second search term result."),
    term3: z.string().describe("The third search term result."),
  }),
  length: summaryLengthSchema,
  tone: summaryToneSchema,
});

export const finalPostSchema = z.object({
  title: z.string().describe("The title of the post."),
  content: z.string().describe("The content of the post."),
});

export type StreamRequest = {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: {
    role: string;
    parts: { text: string }[];
  };
  streaming: boolean;
};

export type TSearchTermResultSchema = z.infer<typeof searchTermResultSchema>;
export type TSummarizeTranscriptSchema = z.infer<
  typeof summarizeTranscriptSchema
>;
export type TSearchTermsSchema = z.infer<typeof searchTermsSchema>;
export type TFinalPostSchema = z.infer<typeof finalPostSchema>;
export type TGenerateBlogSchema = z.infer<typeof generateBlogSchema>;
export type TSummaryToneSchema = z.infer<typeof summaryToneSchema>;
export type TSummaryLengthSchema = z.infer<typeof summaryLengthSchema>;
export type TSummarizeYoutubeVideoSchema = z.infer<
  typeof summarizeYoutubeVideoSchema
>;
