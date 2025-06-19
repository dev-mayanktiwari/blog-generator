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
  signup: (userData) =>
    apiRequest({
      method: "POST",
      url: "/auth/register",
      data: userData,
    }),
};

export default apiClient;
