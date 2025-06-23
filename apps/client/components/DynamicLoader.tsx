"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LoadingMessage {
  text: string;
  subtext: string;
  icon: string;
}

const loadingMessages: LoadingMessage[] = [
  {
    text: "Analyzing Video Content",
    subtext:
      "AI is processing the YouTube video and extracting key information...",
    icon: "🎥",
  },
  {
    text: "Understanding Context",
    subtext: "Identifying main topics, themes, and important details...",
    icon: "🧠",
  },
  {
    text: "Structuring Content",
    subtext: "Organizing information into a logical blog post structure...",
    icon: "📝",
  },
  {
    text: "Crafting Your Blog Post",
    subtext: "Writing engaging content with your specified tone and length...",
    icon: "✨",
  },
  {
    text: "Adding Final Touches",
    subtext: "Polishing the content and ensuring quality...",
    icon: "🎨",
  },
  {
    text: "Almost Ready!",
    subtext: "Finalizing your professional blog post...",
    icon: "🚀",
  },
];

interface DynamicLoaderProps {
  isLoading: boolean;
}

export const DynamicLoader = ({ isLoading }: DynamicLoaderProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 5000); // Change message every 5 seconds

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 800);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const currentMessage = loadingMessages[currentMessageIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <div className="text-4xl animate-bounce">
                {currentMessage?.icon}
              </div>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>

          {/* Dynamic Message */}
          <div className="min-h-[80px]">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-all duration-500">
              {currentMessage?.text}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {currentMessage?.subtext}
            </p>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 95)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% complete • This usually takes 30-90
              seconds...
            </p>
          </div>

          {/* Encouraging Message */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                Creating high-quality content just for you!
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center space-x-2">
            {loadingMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentMessageIndex
                    ? "bg-purple-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
