import type { Metadata } from "next";
import "./globals.css";
import Titlebar from "@/components/Titlebar"

export const metadata: Metadata = {
  title: "Hyperlauncher",
  description: "Linux app launcher of the future. Or at least my future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
      <Titlebar />
        {children}
      </body>
    </html>
  );
}
