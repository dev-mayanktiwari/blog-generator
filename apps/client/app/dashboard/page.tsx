"use client";
import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Navigation } from "@/components/Navigation";
import {
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
  X,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { ProtectedRoute } from "@/components/ProtectedRouteWrapper";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { generateContentService } from "@/lib/apiClient";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  createdAt: string;
  length?: string;
  tone?: string;
  published?: boolean;
  authorId?: number;
  generatedImage?: boolean;
  images?: { url: string; alt: string }[];
}

const DashboardContent = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      console.log("Running");
      setIsLoading(true);
      const response = await generateContentService.getPosts();
      console.log("Fetched posts response:", response);
      //@ts-ignore
      if (response.success) {
        // @ts-ignore
        setPosts(response.data?.posts || []);
      } else {
        toast.error("Error", {
          description: "Failed to load your posts",
        });
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error", {
        description: "Failed to load your posts",
      });
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsFullScreen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setSelectedPost(null);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        closeFullScreen();
      }
    };

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isFullScreen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    const cleanText = text.replace(/[#*`]/g, "").trim();
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-8 w-8" />
                My Blog Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage and view your AI-generated blog posts
              </p>
            </div>

            <Link href="/generate">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Post
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 dark:text-gray-300">
                  Loading your posts...
                </p>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold line-clamp-2 min-h-[3.5rem] leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.createdAt)}
                    </CardDescription>
                  </CardHeader>

                  {/* Fixed height image container */}
                  <div className="px-6 pb-3">
                    <div className="w-full h-32 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      {post.generatedImage &&
                      post.images &&
                      post.images[0]?.url ? (
                        <img
                          src={post.images[0].url}
                          alt={post.images[0].alt || `${post.title} image`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <ImageIcon className="h-8 w-8 mb-1" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="flex-1 flex flex-col pt-0">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.length && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          {post.length}
                        </span>
                      )}
                      {post.tone && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                          {post.tone}
                        </span>
                      )}
                      {post.published !== undefined && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                              : "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      )}
                    </div>

                    {/* Content preview - fixed height */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed h-16 overflow-hidden">
                        {truncateText(post.content, 120)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPost(post)}
                          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {post.videoUrl && (
                          <Link href={post.videoUrl} target="_blank">
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-900 dark:hover:text-green-300"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Video
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !isLoading && posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Generate your first AI-powered blog post from a YouTube video
                  and start building your content library
                </p>
                <Link href="/generate">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Your First Post
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Enhanced Full Screen Post Viewer */}
      {isFullScreen && selectedPost && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={closeFullScreen}
        >
          <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full shadow-2xl mx-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header with Close Button */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>

                <div className="flex gap-2 ml-4">
                  {selectedPost.videoUrl && (
                    <Link href={selectedPost.videoUrl} target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                    </Link>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={closeFullScreen}
                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 pt-8">
                {/* Post Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  {selectedPost.length && (
                    <span className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Length: {selectedPost.length}
                    </span>
                  )}
                  {selectedPost.tone && (
                    <span className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Tone: {selectedPost.tone}
                    </span>
                  )}
                  <span className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Created: {formatDate(selectedPost.createdAt)}
                  </span>
                  {selectedPost.published !== undefined && (
                    <span
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        selectedPost.published
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedPost.published
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      ></span>
                      {selectedPost.published ? "Published" : "Draft"}
                    </span>
                  )}
                </div>

                {/* Featured Image */}
                {selectedPost.generatedImage &&
                  selectedPost.images &&
                  selectedPost.images[0]?.url && (
                    <div className="w-full max-w-2xl mx-auto mb-8">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                        <img
                          src={selectedPost.images[0].url}
                          alt={
                            selectedPost.images[0].alt ||
                            `${selectedPost.title} featured image`
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                {/* Article Content */}
                <article className="max-w-3xl mx-auto">
                  <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-semibold mb-6 mt-12 text-gray-900 dark:text-white">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-medium mb-4 mt-8 text-gray-900 dark:text-white">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-xl font-medium mb-3 mt-6 text-gray-900 dark:text-white">
                            {children}
                          </h4>
                        ),
                        p: ({ children }) => (
                          <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900 dark:text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-800 dark:text-gray-200">
                            {children}
                          </em>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-6 space-y-2 pl-6">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-6 space-y-2 pl-6">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-blue-50 dark:bg-blue-900/20 italic text-lg rounded-r-lg">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6 text-sm">
                            {children}
                          </pre>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        hr: () => (
                          <hr className="my-12 border-gray-200 dark:border-gray-700" />
                        ),
                      }}
                    >
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                </article>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-center">
                    <Button
                      onClick={closeFullScreen}
                      variant="outline"
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Protected Dashboard Component
const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
