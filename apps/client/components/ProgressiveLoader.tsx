import { useState, useEffect } from "react";
import {
  Loader2,
  Youtube,
  FileText,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface ProgressiveLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const loadingStages = [
  {
    id: 1,
    icon: Youtube,
    title: "Loading Video",
    description: "Fetching video content and analyzing transcript...",
    duration: 3000,
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Processing with AI",
    description: "Our AI is understanding the content and structure...",
    duration: 4000,
  },
  {
    id: 3,
    icon: FileText,
    title: "Refining Your Post",
    description: "We value your time - crafting the perfect blog post...",
    duration: 3000,
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Your Post is Ready!",
    description: "Your solid, professional blog post is complete.",
    duration: 1000,
  },
];

export const ProgressiveLoader = ({
  isLoading,
  onComplete,
}: ProgressiveLoaderProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const startStage = (stageIndex: number) => {
      if (stageIndex >= loadingStages.length) {
        onComplete?.();
        return;
      }

      setCurrentStage(stageIndex);
      setProgress(0);

      const stage = loadingStages[stageIndex];
      const progressInterval = 50; // Update every 50ms
      const progressStep = 100 / (stage.duration / progressInterval);

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + progressStep;
          if (newProgress >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return newProgress;
        });
      }, progressInterval);

      stageTimer = setTimeout(() => {
        clearInterval(progressTimer);
        startStage(stageIndex + 1);
      }, stage.duration);
    };

    startStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  const currentStageData = loadingStages[currentStage];
  const Icon = currentStageData?.icon || Loader2;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <Icon
                className={`w-8 h-8 ${currentStage === 3 ? "text-green-500" : "text-purple-600"} ${currentStage < 3 ? "animate-spin" : ""}`}
              />
            </div>
            {currentStage < 3 && (
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentStageData?.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentStageData?.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Stage {currentStage + 1} of {loadingStages.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Stages Indicator */}
          <div className="flex justify-center space-x-2">
            {loadingStages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStage
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Encouraging Message */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
            <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
              ✨ Your post will be solid and professional - we value your time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
