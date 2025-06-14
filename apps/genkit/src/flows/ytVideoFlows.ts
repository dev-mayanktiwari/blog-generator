import { BlogLength, BlogTone } from "../types/types";
import ai from "../utils/ai";

export const videoSummariserFlow = async (
  videoURL: string,
  prompt: string = "Give me the transcript of the video. Give me full transcript of the video. Do not skip any part of the video.",
  language: string = "en",
  length: BlogLength = "medium",
  tone: BlogTone = "neutral"
) => {
  try {
    // Enhance the prompt with length and tone instructions
    const fullPrompt = `${prompt}`;

    const { text } = await ai.generate({
      prompt: [
        { text: fullPrompt },
        { media: { url: videoURL, contentType: "video/mp4" } },
      ],
    });

    console.log(text);
  } catch (error) {
    console.error("Error processing video:", error);
  }
};
