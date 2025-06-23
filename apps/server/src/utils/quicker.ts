import { v6 } from "uuid";
import os from "os";
import dayjs from "dayjs";
import { sign } from "jsonwebtoken";
import { TokenPayload } from "@workspace/types";
import { AppConfig } from "../config";
import bcrypt, { compare } from "bcryptjs";

export default {
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
    };
  },
  getApplicationHealth: () => {
    return {
      environment: AppConfig.get("NODE_ENV"),
      uptime: `${process.uptime().toFixed(2)} seconds`,
      memoryUsage: {
        totalHeap: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
          2
        )} MB`,
        usedHeap: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB`,
      },
    };
  },
  generateVerifyToken: () => {
    const token = v6();
    return token;
  },
  generateCode: (n: number) => {
    if (n <= 0) {
      return null;
    }
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  generateExpiryTime: (minutes: number) => {
    return dayjs().add(minutes, "minutes").toISOString();
  },
  generateJWTToken: async (data: TokenPayload) => {
    const token = await sign(data, String(AppConfig.get("JWT_SECRET")), {
      expiresIn: "30d",
    });
    return token;
  },
  hashPassword: async (password: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },
  comparePassword: async (password: string, hashedPassword: string) => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  },
};
