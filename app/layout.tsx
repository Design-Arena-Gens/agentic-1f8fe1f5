import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Global AI Library",
  description: "Browse, read, and converse with an AI librarian across 500 multilingual books."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-ocean-50">
      <body className="min-h-screen antialiased text-ocean-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
