import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hylo- Weather App",
  description:
    "A weather app built with Next.js, TypeScript, and Tailwind CSS. Get accurate and up-to-date weather information for your location or any city worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <head>
        <link
          href="https://cdn.boxicons.com/3.0.3/fonts/basic/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className="h-full flex flex-col"
        style={{
          background: "linear-gradient(120deg,  #02111f 70%)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
