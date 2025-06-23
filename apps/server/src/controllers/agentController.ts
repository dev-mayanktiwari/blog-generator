import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import { agentsClient } from "@workspace/agents-client";
import { summarizeYoutubeVideoSchema } from "@workspace/types";

export default {
  getGeneratedBlog: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = summarizeYoutubeVideoSchema.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const response = await agentsClient.get_transcript(safeParse.data);
      // console.log("Response from agentsClient:", response);
      
      return httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "Transcript fetched successfully",
        {
          post: response.post,
        }
      );
    }
  ),
};
