import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Sparkles, Star, Users, Clock } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/10 dark:to-blue-400/10 border border-purple-200 dark:border-purple-800 rounded-full px-4 py-2 text-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
              AI-Powered Content Generation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in">
            Turn{" "}
            <span className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              YouTube Videos
            </span>
            <br />
            Into{" "}
            <span className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Posts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Transform any YouTube video into a professionally written,
            SEO-optimized blog post in seconds using advanced AI technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-full text-lg font-semibold border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-200"
              >
                Sign In
              </Button>
            </Link> */}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 pt-12 text-gray-500 dark:text-gray-400 animate-fade-in">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">1000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">30s Generation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl opacity-20 animate-pulse delay-500"></div>
    </section>
  );
};
