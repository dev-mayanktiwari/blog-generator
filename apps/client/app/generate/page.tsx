"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DynamicLoader } from "@/components/DynamicLoader";
import { BlogGenerationForm } from "@/components/BlogGenerationForm";
import { GeneratedPostDisplay } from "@/components/GeneratedPostDisplay";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { generateContentService } from "@/lib/apiClient";
import { TSummarizeYoutubeVideoSchema } from "@workspace/types";

interface GeneratedPost {
  id?: string;
  title: string;
  content: string;
  videoUrl: string;
  createdAt: string;
  length: string;
  tone: string;
  status?: string;
}

type LengthType = "short" | "medium" | "long";
type ToneType =
  | "formal"
  | "informal"
  | "neutral"
  | "professional"
  | "conversational";

const Generate = () => {
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(
    null
  );
  const [publishingToMedium, setPublishingToMedium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleGenerate = async (formData: {
    videoUrl: string;
    length: LengthType;
    tone: ToneType;
  }) => {
    // Clear previous states
    setError(null);
    setGeneratedPost(null);

    // Validation
    if (!formData.videoUrl?.trim() || !formData.length || !formData.tone) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      toast.error("Validation Error", {
        description: errorMsg,
      });
      return;
    }

    if (!user?.id) {
      const errorMsg = "Please log in to generate posts";
      setError(errorMsg);
      toast.error("Authentication Required", {
        description: errorMsg,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Starting generation with payload:", formData);

      const payload: TSummarizeYoutubeVideoSchema = {
        videoURL: formData.videoUrl,
        length: formData.length as any,
        tone: formData.tone as any,
      };

      const response = await generateContentService.generateBlog(payload);
      console.log("API Response:", response);

      // Robust response handling
      if (
        response &&
        //@ts-ignore
        response.data &&
        //@ts-ignore
        response.data.title &&
        //@ts-ignore
        response.data.content
      ) {
        const newPost: GeneratedPost = {
          // @ts-ignore
          title: response.data.title,
          // @ts-ignore
          content: response.data.content,
          videoUrl: formData.videoUrl,
          createdAt: new Date().toISOString(),
          length: formData.length,
          tone: formData.tone,
        };

        setGeneratedPost(newPost);
        console.log("Generated post set successfully:", newPost);

        toast.success("Success!", {
          description: "Your blog post has been generated successfully!",
          duration: 5000,
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error generating post:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate blog post. Please try again.";

      setError(errorMessage);

      toast.error("Generation Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToMedium = async () => {
    if (!generatedPost || !user?.id) {
      toast.error("Error", {
        description: "No post to publish or user not logged in",
      });
      return;
    }

    setPublishingToMedium(true);
    setError(null);

    try {
      // TODO: Implement Medium API integration
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Published!", {
        description:
          "Your blog post has been published to Medium successfully!",
        duration: 5000,
      });

      // Optionally redirect to dashboard or Medium
      // router.push("/dashboard");
    } catch (error) {
      console.error("Error publishing to Medium:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to publish to Medium";

      setError(errorMessage);
      toast.error("Publishing Failed", {
        description: errorMessage,
      });
    } finally {
      setPublishingToMedium(false);
    }
  };

  // Show loading state for auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Navigation />

      {/* Dynamic Loader */}
      <DynamicLoader isLoading={loading} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Form Section */}
          <BlogGenerationForm
            onSubmit={handleGenerate}
            loading={loading}
            error={error}
          />

          {/* Generated Content */}
          {generatedPost && (
            <GeneratedPostDisplay
              post={generatedPost}
              onPublishToMedium={handlePublishToMedium}
              publishingToMedium={publishingToMedium}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
