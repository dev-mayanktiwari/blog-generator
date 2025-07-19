import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { AuthProvider, Providers } from "@/components/providers";
import { Toaster } from "@workspace/ui/components/sonner";
import { Analytics } from "@vercel/analytics/next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <AuthProvider>
            {children}
            <Analytics />
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
