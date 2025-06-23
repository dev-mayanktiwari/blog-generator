import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Content?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are already using AI to supercharge
          their content creation.
        </p>
        <Link href="/get-started">
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Start Creating Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
