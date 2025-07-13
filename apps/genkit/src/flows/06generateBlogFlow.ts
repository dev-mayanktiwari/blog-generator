import {
  summarizeYoutubeVideoSchema,
  TGenerateBlogSchema,
} from "@workspace/types";
import ai from "../services/ai";
import { summariseYoutubeVideoFlow } from "./01summariseYoutubeVideoFlow";
import { generateSearchTermsFlow } from "./02generateSearchTerms";
import { generateFinalSummaryFlow } from "./04generateFinalSummaryFlow";
import { onCallGenkit } from "firebase-functions/https";
import { getSearchTermResultsFlow } from "./03getSearchTermResults";
import { logger } from "@workspace/utils";
import { uploadImageToGCS } from "../services/uploadToCloud";
import { imagenImageGenerationFlow } from "./05imageGenerationFlow";

export const generateBlogFlow = ai.defineFlow(
  {
    name: "generateFullBlogFinalFlow",
    inputSchema: summarizeYoutubeVideoSchema,
  },
  async ({ videoURL, length, tone, contentType, generateImage }) => {
    const summary = await summariseYoutubeVideoFlow({
      videoURL,
      length,
      tone,
      contentType,
      generateImage,
    });
    const searchTermsPromise = generateSearchTermsFlow(summary);

    // Start image generation in parallel if requested
    const imagePromise = generateImage
      ? imagenImageGenerationFlow({ summary: summary.summary })
      : Promise.resolve(null);

    const searchTerms = await searchTermsPromise;
    const searchTermsResults = await getSearchTermResultsFlow(searchTerms);

    const generateSummaryPayload: TGenerateBlogSchema = {
      summary: summary.summary,
      searchTerms: searchTerms.searchTerms,
      // @ts-ignore
      searchTermResults: searchTermsResults,
      length,
      tone,
      contentType,
    };

    const postPromise = generateFinalSummaryFlow(generateSummaryPayload);

    // Wait for post and image (if requested) in parallel
    const [post, image] = await Promise.all([postPromise, imagePromise]);

    const userId = 123;
    let imageUrl = null;

    logger.info("Processing image generation result", {
      meta: {
        hasImage: !!image,
        imageType: typeof image,
        imageKeys: image ? Object.keys(image) : null,
        fullImageObject: image,
      },
    });

    if (image && image.url) {
      const imageData = image.url;

      // Validate base64 data
      if (!imageData || typeof imageData !== "string") {
        logger.error("Invalid image data received", {
          meta: {
            imageDataType: typeof imageData,
            hasImageData: !!imageData,
          },
        });
        return {
          summary,
          searchTerms,
          searchTermsResults,
          post: {
            title: post.title,
            content: post.content,
          },
          imageUrl: "invalid_image_data",
        };
      }

      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      let cleanBase64 = imageData;

      if (imageData.startsWith("data:")) {
        const base64Index = imageData.indexOf(",");
        if (base64Index !== -1) {
          cleanBase64 = imageData.substring(base64Index + 1);
        }
      }

      if (!base64Regex.test(cleanBase64)) {
        logger.error("Invalid base64 format", {
          meta: {
            originalLength: imageData.length,
            cleanLength: cleanBase64.length,
            startsWithData: imageData.startsWith("data:"),
            first50Chars: imageData.substring(0, 50),
          },
        });
        return {
          summary,
          searchTerms,
          searchTermsResults,
          post: {
            title: post.title,
            content: post.content,
          },
          imageUrl: "invalid_base64_format",
        };
      }

      logger.info("Starting image upload", {
        meta: {
          originalDataLength: imageData.length,
          cleanBase64Length: cleanBase64.length,
          hasImageData: !!imageData,
          dataType: typeof imageData,
        },
      });

      try {
        const imageBuffer = Buffer.from(cleanBase64, "base64");

        if (imageBuffer.length === 0) {
          logger.error("Empty image buffer created", {
            meta: {
              originalDataLength: imageData.length,
              cleanBase64Length: cleanBase64.length,
            },
          });
          return {
            summary,
            searchTerms,
            searchTermsResults,
            post: {
              title: post.title,
              content: post.content,
            },
            imageUrl: "empty_buffer",
          };
        }

        logger.info("Created image buffer", {
          meta: {
            bufferLength: imageBuffer.length,
            bufferType: typeof imageBuffer,
          },
        });

        const timestamp = Date.now();
        const filename = `blog_image_${userId}_${timestamp}.png`;

        const url = await uploadImageToGCS(imageBuffer, String(userId), "png");

        logger.info("Image uploaded successfully", {
          meta: {
            url,
            filename,
            bufferSize: imageBuffer.length,
          },
        });

        imageUrl = url;

        try {
          const response = await fetch(url, { method: "HEAD" });
          if (!response.ok) {
            logger.error("Uploaded image URL not accessible", {
              meta: {
                url,
                status: response.status,
                statusText: response.statusText,
              },
            });
            imageUrl = "url_not_accessible";
          }
        } catch (fetchError: any) {
          logger.error("Error checking uploaded image URL", {
            meta: {
              url,
              error: fetchError.message,
            },
          });
        }
      } catch (uploadError: any) {
        logger.error("Error uploading image", {
          meta: {
            error: uploadError.message,
            stack: uploadError.stack,
            imageDataLength: imageData.length,
            bufferLength: cleanBase64.length,
          },
        });
        imageUrl = "upload_failed";
      }
    } else {
      logger.info("No image to upload", {
        meta: {
          hasImage: !!image,
          imageType: typeof image,
          hasUrl: image?.url || false,
          imageStructure: image ? JSON.stringify(image, null, 2) : null,
        },
      });
    }

    return {
      summary,
      searchTerms,
      searchTermsResults,
      post: {
        title: post.title,
        content: post.content,
      },
      imageUrl,
    };
  }
);
