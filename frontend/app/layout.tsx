import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { DashboardProvider } from "@/context/DashboardContext";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = {
  title: "Collabify",
  description: "Real Time Editor",
  icons: {
    icon: "/collabify.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
          <SpeedInsights/>
        </body>
      </html>
    </DashboardProvider>
  );
}
