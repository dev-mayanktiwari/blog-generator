import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Youtube, FileText } from "lucide-react";

export const DemoSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video Input Demo */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                1. Paste YouTube URL
              </CardTitle>
              <CardDescription className="text-lg">
                Simply paste any YouTube video link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
                https://youtube.com/watch?v=example
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex justify-center">
            <ArrowRight className="w-12 h-12 text-purple-500 animate-pulse" />
          </div>

          {/* Blog Output Demo */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 md:col-start-2">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                2. Get Professional Blog
              </CardTitle>
              <CardDescription className="text-lg">
                AI generates a complete, ready-to-publish post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
