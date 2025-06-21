import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Zap, Sparkles, FileText } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to create amazing content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold">
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Generate professional blog posts in under 30 seconds
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Advanced AI understands context and creates engaging content
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold">SEO Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Content optimized for search engines and readability
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
