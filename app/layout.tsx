import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EthicsBanner from "@/components/EthicsBanner";

export const metadata: Metadata = {
  title: "Can you Hack? — Free Cybersecurity Lab",
  description:
    "Learn pentesting, digital forensics, and network analysis from zero to intermediate — in your browser. Free, open source, by Shayan Ahmad (Tech Sol).",
  openGraph: {
    title: "Can you Hack? — Free Cybersecurity Lab",
    description: "From zero to hacker — legally. Pentesting, forensics & network analysis labs in your browser.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-neon focus:text-black focus:px-3 focus:py-2 focus:rounded z-50">
          Skip to content
        </a>
        <EthicsBanner />
        <Navbar />
        <div id="main" className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
