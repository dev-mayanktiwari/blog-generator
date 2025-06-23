import {
  TSummarizeYoutubeVideoSchema,
  TUserLoginInput,
  TUserRegistrationInput,
} from "@workspace/types";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Generic API request function
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// API service functions
export const authService = {
  // @ts-ignore
  signup: (userData: TUserRegistrationInput) =>
    apiRequest({
      method: "POST",
      url: "/auth/register",
      data: userData,
    }),
  login: (credentials: TUserLoginInput) =>
    apiRequest({
      method: "POST",
      url: "/auth/login",
      data: credentials,
    }),
  logout: () =>
    apiRequest({
      method: "POST",
      url: "/auth/logout",
    }),
  checkAuth: () =>
    apiRequest({
      method: "GET",
      url: "/auth/me",
    }),
};

export const generateContentService = {
  generateBlog: (data: TSummarizeYoutubeVideoSchema) =>
    apiRequest({
      method: "POST",
      url: "/user/generate-blog",
      data,
    }),
};

export default apiClient;
