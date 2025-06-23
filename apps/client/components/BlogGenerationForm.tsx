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
import { Youtube, Zap, Image, Sparkles, AlertCircle } from "lucide-react";

type LengthType = "short" | "medium" | "long";
type ToneType =
  | "formal"
  | "informal"
  | "neutral"
  | "professional"
  | "conversational";

interface BlogGenerationFormProps {
  onSubmit: (data: {
    videoUrl: string;
    length: LengthType;
    tone: ToneType;
  }) => void;
  loading: boolean;
  error: string | null;
}

export const BlogGenerationForm = ({
  onSubmit,
  loading,
  error,
}: BlogGenerationFormProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [length, setLength] = useState<LengthType | "">("");
  const [tone, setTone] = useState<ToneType | "">("");
  const [generateImages, setGenerateImages] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    if (!url || typeof url !== "string") return false;

    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl?.trim() || !length || !tone) {
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      return;
    }

    onSubmit({
      videoUrl: videoUrl.trim(),
      length: length as LengthType,
      tone: tone as ToneType,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <Youtube className="w-6 h-6 text-red-500" />
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            YouTube to Blog Generator
          </span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Transform Videos into Professional Blogs
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Enter any YouTube URL and let AI create a comprehensive,
          well-structured blog post for you
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span>Generate Your Blog Post</span>
          </CardTitle>
          <CardDescription className="text-base">
            Fill in the details below to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div className="space-y-3">
              <Label htmlFor="videoUrl" className="text-base font-semibold">
                YouTube Video URL *
              </Label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:border-purple-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="length" className="text-base font-semibold">
                  Content Length *
                </Label>
                <Select
                  value={length}
                  onValueChange={(v) => setLength(v as LengthType)}
                  required
                >
                  <SelectTrigger className="h-12 text-base border-2">
                    <SelectValue placeholder="Choose length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">
                      📝 Short (500-800 words)
                    </SelectItem>
                    <SelectItem value="medium">
                      📄 Medium (800-1500 words)
                    </SelectItem>
                    <SelectItem value="long">📚 Long (1500+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tone" className="text-base font-semibold">
                  Writing Tone *
                </Label>
                <Select
                  value={tone}
                  onValueChange={(v) => setTone(v as ToneType)}
                  required
                >
                  <SelectTrigger className="h-12 text-base border-2">
                    <SelectValue placeholder="Choose tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversational">
                      💬 Conversational
                    </SelectItem>
                    <SelectItem value="professional">
                      👔 Professional
                    </SelectItem>
                    <SelectItem value="neutral">⚖️ Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center mb-4">
                <Sparkles className="w-5 h-5 mr-2" />
                Advanced Options
              </h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image className="w-5 h-5 text-blue-500" />
                  <div>
                    <Label
                      htmlFor="generate-images"
                      className="text-base font-medium"
                    >
                      Auto-generate Images
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add relevant images to your blog post
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
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

            {/* Generate Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading || !videoUrl.trim() || !length || !tone}
            >
              <Zap className="mr-3 h-6 w-6" />
              Generate Blog Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
