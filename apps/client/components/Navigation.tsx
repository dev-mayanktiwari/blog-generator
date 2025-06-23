"use client";

import { Button } from "@workspace/ui/components/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            BlogAI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {!loading && user ? (
              <>
                <Link href="/generate">
                  <Button variant="ghost">Generate</Button>
                </Link>
                <div className="flex items-center space-x-2">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : !loading && !user ? (
              <>
                <Link href="/get-started">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/get-started">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              // Loading state
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <div className="flex items-center justify-between px-3 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>

              {!loading && user ? (
                <>
                  <Link href="/generate">
                    <Button variant="ghost" className="w-full justify-start">
                      Generate
                    </Button>
                  </Link>
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center space-x-2 mb-2">
                      {user.image && (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium">
                        {user.name || user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : !loading && !user ? (
                <>
                  <Link href="/get-started">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/get-started">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              ) : (
                // Loading state
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
