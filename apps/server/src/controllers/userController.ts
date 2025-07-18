import { NextFunction, Request, response, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  AuthenticatedRequest,
  summarizeYoutubeVideoSchema,
} from "@workspace/types";
import dbServices from "../services/dbServices";
import { AppConfig } from "../config";
import { sampleData } from "../utils/data";

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
      if (!userId) {
        return httpError(
          next,
          new Error("User ID is missing"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST
        );
      }
      try {
        const response = await fetch(String(AppConfig.get("GENKIT_FLOW_URL")), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${String(AppConfig.get("GENKIT_API_KEY"))}`,
            "X-User-Id": String(userId),
          },
          body: JSON.stringify({ data: safeParse.data }),
        });
        console.log("Response", response);
        // Force post to be any to avoid linter errors on imageUrl
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const post: any = await response.json();
        const finalPost = post?.result?.post;
        console.log("Response from Genkit:", finalPost);
        //@ts-ignore
        if (
          !response.ok ||
          !post ||
          // @ts-ignore
          !finalPost.title ||
          // @ts-ignore
          !finalPost.content
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
        let dbPost;
        if (safeParse.data.generateImage && post.result?.imageUrl) {
          const postPayload = {
            userId: userId,
            title: finalPost.title,
            content: finalPost.content,
            videoUrl: safeParse.data.videoURL,
            tone: safeParse.data.tone,
            length: safeParse.data.length,
            contentType: safeParse.data.contentType,
            generateImage: true,
            imageUrl: post?.result?.imageUrl,
          };
          dbPost = await dbServices.addUserPostWithEmail(postPayload);
        } else {
          const postPayload = {
            userId: userId,
            title: finalPost.title,
            content: finalPost.content,
            videoUrl: safeParse.data.videoURL,
            tone: safeParse.data.tone,
            length: safeParse.data.length,
            generateImage: false,
            contentType: safeParse.data.contentType,
          };
          dbPost = await dbServices.addUserPostWithoutImage(postPayload);
        }
        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "Post generated successfully",
          {
            title: dbPost.title,
            content: dbPost.content,
            imageUrl: post.result?.imageUrl,
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

  dummyGeneration: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Dummy generation successful",
        sampleData
      );
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
