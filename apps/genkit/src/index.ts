import { videoSummariserFlow } from "./flows/ytVideoFlows";

(async () => {
  try {
    const videoURL = "https://www.youtube.com/watch?v=iGvNCo62Wb4"; // Example video URL
    const prompt = "Please summarize the following video in 500 words:";
    const language = "english";
    const length = "long";
    const tone = "neutral";

    await videoSummariserFlow(videoURL, undefined, language, length, tone);
  } catch (error) {
    console.error("Error in video summarization flow:", error);
  }
})();
