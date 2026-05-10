import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MixSpace — See Your Mix in 3D",
  description:
    "Upload any song. Watch it explode into a 3D space. Find what's masking, what's flat, what's missing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-bg-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
