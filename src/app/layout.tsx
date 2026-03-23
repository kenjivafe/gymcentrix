import type { Metadata } from "next";
import { Unbounded, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const geist = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Gymcentrix | The OS for Modern Gyms",
  description:
    "Professional gym management SaaS with RFID sign-in, analytics, and member engagement.",
  icons: {
    icon: "/app/gymcentrix-logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${unbounded.variable} ${geist.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-canvas text-white antialiased min-h-screen font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
