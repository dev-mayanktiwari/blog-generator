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
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  createdAt: string;
  length?: string;
  tone?: string;
  status?: string;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchPosts();
  }, [user, loading, router]);

  const fetchPosts = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/posts/user/${user.id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error("Failed to fetch posts");
        toast.error("Error", {
          description: "Failed to load your posts",
        });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error", {
        description: "Failed to load your posts",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Success", {
          description: "Post deleted successfully",
        });
      } else {
        toast.error("Error", {
          description: "Failed to delete post",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error", {
        description: "Failed to delete post",
      });
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

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Blog Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and view your AI-generated blog posts
              </p>
            </div>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-4 sm:mt-0">
                <FileText className="w-4 h-4 mr-2" />
                Generate New Post
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="text-center py-16">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
                <p className="text-gray-600 dark:text-gray-300">
                  Loading your posts...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 text-purple-800 dark:text-purple-200">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {post.length && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full">
                          {post.length}
                        </span>
                      )}
                      {post.tone && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                          {post.tone}
                        </span>
                      )}
                      {post.status && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                          {post.status}
                        </span>
                      )}
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm mb-4">
                      <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                        {post.content.replace(/[#*`]/g, "").substring(0, 150)}
                        ...
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPost(post)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        {post.videoUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={post.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Video
                            </a>
                          </Button>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="text-gray-400 relative overflow-hidden"
                          title="Coming Soon"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Medium
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !loading && posts.length === 0 ? (
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No blog posts yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Generate your first AI-powered blog post from a YouTube video
                </p>
                <Link href="/generate">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Your First Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Full Screen Post Viewer */}
      {isFullScreen && selectedPost && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {selectedPost.length && (
                    <span>Length: {selectedPost.length}</span>
                  )}
                  {selectedPost.tone && <span>Tone: {selectedPost.tone}</span>}
                  <span>Created: {formatDate(selectedPost.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  disabled
                  className="relative overflow-hidden"
                  title="Coming Soon - Publish directly to Medium"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Publish to Medium
                </Button>
                <Button variant="outline" onClick={closeFullScreen}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none">
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
                    {selectedPost.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
