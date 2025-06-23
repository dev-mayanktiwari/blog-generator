"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Navigation } from "@/components/Navigation";
import { ProgressiveLoader } from "@/components/ProgressiveLoader";
import { toast } from "sonner";
import {
  Loader2,
  Youtube,
  FileText,
  Save,
  Sparkles,
  Image,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import ReactMarkdown from "react-markdown";
import { generateContentService } from "@/lib/apiClient";
import {
  TSummarizeYoutubeVideoSchema,
  TSummaryLengthSchema,
  TSummaryToneSchema,
} from "@workspace/types";

interface GeneratedPost {
  id: string;
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
  const [videoUrl, setVideoUrl] = useState("");
  const [length, setLength] = useState<LengthType | "">("");
  const [tone, setTone] = useState<ToneType | "">("");
  const [generateImages, setGenerateImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const validateYouTubeUrl = (url: string) => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl || !length || !tone) {
      toast.error("Error", {
        description: "Please fill in all fields",
      });
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      toast.error("Error", {
        description: "Please enter a valid YouTube URL",
      });
      return;
    }

    if (!user?.id) {
      toast.error("Error", {
        description: "Please log in to generate posts",
      });
      return;
    }

    setLoading(true);

    try {
      const payload: TSummarizeYoutubeVideoSchema = {
        videoURL: videoUrl,
        length,
        tone,
      };
      const data: any = await generateContentService.generateBlog(payload);

      setGeneratedPost(data.post);

      toast.success("Success", {
        description: "Blog post generated successfully!",
      });
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate blog post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPost || !user?.id) return;

    setSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...generatedPost,
          userId: user.id,
        }),
      });

      if (response.ok) {
        toast.success("Success", {
          description: "Post saved to your dashboard!",
        });
        // Optionally redirect to dashboard
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to save post",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Navigation />

      {/* Progressive Loader */}
      <ProgressiveLoader isLoading={loading} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Generate Blog Post
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Transform any YouTube video into a professional blog post
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span>Video Details</span>
                </CardTitle>
                <CardDescription>
                  Enter the YouTube video URL and customize your blog post
                  settings
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">YouTube Video URL</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Select
                        value={length}
                        onValueChange={(v) => setLength(v as LengthType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">
                            Short (500-800 words)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (800-1500 words)
                          </SelectItem>
                          <SelectItem value="long">
                            Long (1500+ words)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select
                        value={tone}
                        onValueChange={(v) => setTone(v as ToneType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conversational">
                            Conversational
                          </SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Advanced Options
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image className="w-4 h-4 text-blue-500" />
                        <Label htmlFor="generate-images" className="text-sm">
                          Generate Images
                        </Label>
                        <span className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <Switch
                        id="generate-images"
                        checked={generateImages}
                        onCheckedChange={setGenerateImages}
                        disabled
                        className="opacity-50"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Blog Post...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Blog Post
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generated Content */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    <span>Generated Content</span>
                  </CardTitle>
                  {generatedPost && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        variant="outline"
                        size="sm"
                      >
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Post
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="relative overflow-hidden"
                        title="Coming Soon - Publish directly to Medium"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Medium
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Your AI-generated blog post will appear here
                </CardDescription>
              </CardHeader>

              <CardContent>
                {generatedPost ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                        {generatedPost.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>Length: {generatedPost.length}</span>
                        <span>Tone: {generatedPost.tone}</span>
                        {generatedPost.status && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                            {generatedPost.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mt-8 mb-6 text-purple-900 dark:text-purple-100">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-900 dark:text-purple-100">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xl font-semibold mt-6 mb-3 text-purple-800 dark:text-purple-200">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900 dark:text-gray-100">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          li: ({ children }) => (
                            <li className="ml-4 mb-2">{children}</li>
                          ),
                        }}
                      >
                        {generatedPost.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generated blog post will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
