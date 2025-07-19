"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DynamicLoader } from "@/components/DynamicLoader";
import { BlogGenerationForm } from "@/components/BlogGenerationForm";
import { GeneratedPostDisplay } from "@/components/GeneratedPostDisplay";
import { ProtectedRoute } from "@/components/ProtectedRouteWrapper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { generateContentService } from "@/lib/apiClient";
import {
  TSummarizeYoutubeVideoSchema,
  TSummaryLengthSchema,
  TSummaryToneSchema,
} from "@workspace/types";

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

const GenerateContent = () => {
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(
    null
  );
  const [publishingToMedium, setPublishingToMedium] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // No need for authLoading here since ProtectedRoute handles it
  const router = useRouter();

  const handleGenerate = async (formData: TSummarizeYoutubeVideoSchema) => {
    // Clear previous states
    setError(null);
    setGeneratedPost(null);

    // Validation
    if (!formData.videoURL?.trim() || !formData.length || !formData.tone) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      toast.error("Validation Error", {
        description: errorMsg,
      });
      return;
    }

    // At this point, we know user exists because of ProtectedRoute
    if (!user?.id) {
      const errorMsg = "Authentication error. Please try logging in again.";
      setError(errorMsg);
      toast.error("Authentication Required", {
        description: errorMsg,
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting generation with payload:", formData);

      const payload: TSummarizeYoutubeVideoSchema = {
        videoURL: formData.videoURL.trim(),
        length: formData.length as any,
        tone: formData.tone as any,
        contentType: formData.contentType,
        additionalPrompt: formData.additionalPrompt?.trim(),
        generateImage: formData.generateImage,
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
          videoUrl: formData.videoURL,
          createdAt: new Date().toISOString(),
          length: formData.length,
          tone: formData.tone,
          // @ts-ignore
          imageUrl: response.data.imageUrl || null,
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

// Wrap the component with ProtectedRoute
const Generate = () => {
  return (
    <ProtectedRoute>
      <GenerateContent />
    </ProtectedRoute>
  );
};

export default Generate;
