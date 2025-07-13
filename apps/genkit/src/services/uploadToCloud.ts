import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@workspace/utils";
import { AppConfig } from "../config";

const BUCKET_NAME = String(AppConfig.get("GCS_BUCKET_NAME"));
const storage = new Storage();

export async function uploadImageToGCS(
  imageBuffer: Buffer,
  userId: string,
  extension = "png"
) {
  const fileName = `${userId}/${uuidv4()}.${extension}`;
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(fileName);

  // Log buffer info for debugging
  logger.info("Preparing to upload image buffer", {
    meta: {
      bufferLength: imageBuffer.length,
      bufferPreview: imageBuffer.slice(0, 16).toString("hex"),
      fileName,
      bucketName: BUCKET_NAME,
    },
  });

  if (!imageBuffer || imageBuffer.length < 100) {
    logger.error("Image buffer is too small or empty. Not uploading.", {
      meta: {
        bufferLength: imageBuffer.length,
        fileName,
      },
    });
    throw new Error("Image buffer is too small or empty");
  }

  try {
    await file.save(imageBuffer, {
      resumable: false,
      contentType: `image/${extension}`,
    });

    logger.info("Image uploaded to GCS successfully", {
      meta: {
        fileName,
        bucketName: BUCKET_NAME,
        url: `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`,
      },
    });

    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
  } catch (error: any) {
    logger.error("Failed to upload image to GCS", {
      meta: {
        error: error.message,
        fileName,
        bucketName: BUCKET_NAME,
      },
    });
    throw error;
  }
}
