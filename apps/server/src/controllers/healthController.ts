import { Request, Response } from "express";
import { asyncErrorHandler, httpResponse } from "@workspace/utils";
import quicker from "../utils/quicker";
import dayjs from "dayjs";
import { SuccessStatusCodes } from "@workspace/constants";

export default {
  self: asyncErrorHandler(async (req: Request, res: Response) => {
    httpResponse(req, res, SuccessStatusCodes.OK, "Hello World", {
      name: "Mayank Tiwari",
    });
  }),

  health: asyncErrorHandler(async (req: Request, res: Response) => {
    const healthData = {
      application: quicker.getApplicationHealth(),
      system: quicker.getSystemHealth(),
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    httpResponse(req, res, SuccessStatusCodes.OK, "Health Check", healthData);
  }),
};
