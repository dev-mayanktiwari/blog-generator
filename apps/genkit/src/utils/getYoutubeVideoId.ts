import getYouTubeID from "get-youtube-id";

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID or undefined if the URL is invalid.
 */
export const getYoutubeVideoId = (url: string): string | null => {
  try {
    const videoId = getYouTubeID(url);
    return videoId;
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
    return null;
  }
};
