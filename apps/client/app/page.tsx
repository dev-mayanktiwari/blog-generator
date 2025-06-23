import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeautresSection";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { CTASection } from "@/components/CTASection";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Navigation />

      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <ComingSoonSection />
      <CTASection />

      {/* <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">Welcome to BlogAI</h1>
        <p className="mb-8">Create amazing content with AI-powered tools.</p>
        <Link href="/get-started">
          <Button variant="outline">Get Started</Button>
        </Link>
      </main> */}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by</span>
            <a
              href="https://www.mayanktiwari.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
            >
              Mayank
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
