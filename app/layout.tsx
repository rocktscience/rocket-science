import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "./providers/TranslationProvider";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Rocket Science LLC - Record Label & Music Publishing",
    template: "%s | Rocket Science LLC"
  },
  description: "Artist development for exceptional talent. Distribution and publishing services for established artists and labels.",
  keywords: ["music", "record label", "music publishing", "distribution", "artist development"],
  openGraph: {
    title: "Rocket Science LLC",
    description: "Artist development for exceptional talent. Distribution and publishing services for established artists and labels.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-light antialiased`}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}