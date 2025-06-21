import { Sparkles } from "lucide-react";

export const ComingSoonSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-400/10 dark:to-purple-400/10 border border-indigo-200 dark:border-indigo-800 rounded-full px-4 py-2 text-sm mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Next-Level Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're working on exciting new features to make your content creation
            journey even more powerful
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Medium Integration */}
          <div className="text-center space-y-6 group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-3xl">M</span>
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                Medium Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Publish your AI-generated posts directly to Medium with a single
                click. Seamlessly connect your workflow.
              </p>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto opacity-60"></div>
          </div>

          {/* AI Image Generation */}
          <div className="text-center space-y-6 group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mx-auto blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                AI Image Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Automatically generate stunning, relevant images for your blog
                posts using advanced AI technology.
              </p>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
