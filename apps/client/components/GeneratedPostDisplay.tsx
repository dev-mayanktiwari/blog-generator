"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  FileText,
  Youtube,
  Sparkles,
  CheckCircle,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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

interface GeneratedPostDisplayProps {
  post: GeneratedPost;
  onPublishToMedium?: () => void;
  publishingToMedium?: boolean;
}

export const GeneratedPostDisplay = ({
  post,
  onPublishToMedium,
  publishingToMedium,
}: GeneratedPostDisplayProps) => {
  const postRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show scroll prompt and auto-scroll to the generated post
    const timer = setTimeout(() => {
      if (postRef.current) {
        postRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={postRef}>
      {/* Scroll Indicator */}
      <div className="text-center mb-6 animate-bounce">
        <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Your blog post is ready! Scroll down to view
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span>Your Blog Post is Ready!</span>
            </CardTitle>
            <div className="flex space-x-3">
              <Button
                onClick={onPublishToMedium}
                disabled
                variant={"outline"}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {publishingToMedium ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Publish to Medium (Coming Soon)
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription className="text-base">
            Your professional blog post has been generated successfully! You can
            now publish it directly to Medium.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Post Metadata */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Length: {post.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Tone: {post.tone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Youtube className="w-4 h-4" />
                <span>Generated from video</span>
              </div>
            </div>

            {/* Post Title */}
            <div>
              <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4 leading-tight">
                {post.title}
              </h3>
            </div>

            {/* Post Content */}
            <div className="prose dark:prose-invert max-w-none">
              <div className="border rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 shadow-inner">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-6 text-purple-900 dark:text-purple-100 border-b pb-2 border-purple-200 dark:border-purple-800">
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
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 dark:text-gray-100">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-purple-700 dark:text-purple-300">
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="ml-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 dark:bg-purple-900/20 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 text-center">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  🎉 Your Blog Post is Ready!
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Click "Publish to Medium" above to share your content with the
                  world, or copy the content to use elsewhere.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
