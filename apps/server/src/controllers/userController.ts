import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  AuthenticatedRequest,
  summarizeYoutubeVideoSchema,
} from "@workspace/types";
import dbServices from "../services/dbServices";
import { AppConfig } from "../config";

export default {
  generatePost: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = summarizeYoutubeVideoSchema.safeParse(body);
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      try {
        const response = await fetch(String(AppConfig.get("GENKIT_FLOW_URL")), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AppConfig.get("GENKIT_API_KEY")}`,
          },
          body: JSON.stringify({
            videoURL: safeParse.data.videoURL,
            tone: safeParse.data.tone,
            length: safeParse.data.length,
            contentType: safeParse.data.contentType,
            generateImage: safeParse.data.generateImage,
          }),
        });
        console.log("Response", response);
        const post = await response.json();

        console.log("Response from Genkit:", post);
        //@ts-ignore
        if (
          !response.ok ||
          !post ||
          // @ts-ignore
          !post.post.title ||
          // @ts-ignore
          !post.post.content ||
          // @ts-ignore
          !post.imageUrl
        ) {
          // console.log(response.ok);
          console.log("Error", response.status, response);
          return httpError(
            next,
            new Error("Failed to generate post"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
          );
        }

        console.log("Generated post:", post);
        const postPayload = {
          userId: userId,
          //@ts-ignore
          title: post.post.title,
          //@ts-ignore
          content: post.post.content,
          videoUrl: safeParse.data.videoURL,
          tone: safeParse.data.tone,
          length: safeParse.data.length,
          contentType: safeParse.data.contentType,
          generateImage: safeParse.data.generateImage,
          //@ts-ignore
          imageUrl: post.imageUrl || null,
        };

        const dbPost = await dbServices.addUserPost(postPayload);
        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Post generated successfully",
          {
            title: dbPost.title,
            content: dbPost.content,
          }
        );
      } catch (error) {
        console.error("Error generating post:", error);
        return httpError(
          next,
          new Error("Failed to generate post"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }
    }
  ),

  getUserPosts: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as AuthenticatedRequest).user?.id;

      try {
        const posts = await dbServices.getUserPosts(userId);
        if (!posts || posts.length === 0) {
          httpResponse(
            req,
            res,
            SuccessStatusCodes.OK,
            "No posts found for this user",
            { posts: [] }
          );
        } else {
          httpResponse(
            req,
            res,
            SuccessStatusCodes.OK,
            "Posts fetched successfully",
            { posts }
          );
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        httpError(
          next,
          new Error("Failed to fetch user posts"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),
};
