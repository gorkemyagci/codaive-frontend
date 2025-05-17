import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codaive - AI Powered Code Editor",
  description: "Codaive is a next-generation AI-powered code editor that combines the power of OpenAI and Claude AI with advanced code editing capabilities. Features include real-time code analysis, intelligent code completion, and seamless GitHub integration.",
  keywords: "AI code editor, code completion, GitHub integration, OpenAI, Claude AI, code analysis, development tools, programming assistant, code optimization, real-time coding",
  authors: [{ name: "Codaive Team" }],
  creator: "Codaive",
  publisher: "Codaive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://codaive.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Codaive - AI Powered Code Editor",
    description: "Transform your coding experience with Codaive's AI-powered code editor. Get intelligent code suggestions, real-time analysis, and seamless GitHub integration.",
    url: "https://codaive.com",
    siteName: "Codaive",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Codaive AI Code Editor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codaive - AI Powered Code Editor",
    description: "Transform your coding experience with Codaive's AI-powered code editor. Get intelligent code suggestions, real-time analysis, and seamless GitHub integration.",
    images: ["/twitter-image.png"],
    creator: "@codaive",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
