from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

def get_transcript(video_id: str) -> str:
    """
    Fetches the transcript for a given YouTube video ID.

    Args:
        video_id (str): The unique identifier of the YouTube video.

    Returns:
        str: The full transcript of the YouTube video as a single string.

    Raises:
        ValueError: If the transcript is unavailable, disabled, or cannot be retrieved.
    """
    try:
        fetched_transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([snippet['text'] for snippet in fetched_transcript])
        return transcript
    except TranscriptsDisabled:
        raise ValueError("Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise ValueError("No transcript available for this video.")
    except VideoUnavailable:
        raise ValueError("The video is unavailable or the ID is incorrect.")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred while fetching the transcript: {e}")