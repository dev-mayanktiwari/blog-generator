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
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <Card key={post.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.length && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {post.length}
                        </span>
                      )}
                      {post.tone && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                          {post.tone}
                        </span>
                      )}
                      {post.published !== undefined && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            post.published
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 mb-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {post.content.replace(/[#*`]/g, "").substring(0, 150)}
                        ...
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPost(post)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {post.videoUrl && (
                          <Link href={post.videoUrl} target="_blank">
                            <Button size="sm" variant="outline">
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
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate your first AI-powered blog post from a YouTube video
              </p>
              <Link href="/generate">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Your First Post
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Full Screen Post Viewer */}
      {isFullScreen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedPost.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedPost.length && (
                    <span>Length: {selectedPost.length} • </span>
                  )}
                  {selectedPost.tone && (
                    <span>Tone: {selectedPost.tone} • </span>
                  )}
                  <span>Created: {formatDate(selectedPost.createdAt)}</span>
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={closeFullScreen}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1 text-gray-700 dark:text-gray-300">
                        {children}
                      </li>
                    ),
                  }}
                >
                  {selectedPost.content}
                </ReactMarkdown>
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
