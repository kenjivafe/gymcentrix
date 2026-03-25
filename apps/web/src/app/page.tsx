import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Gymcentrix | All-in-One Gym Management SaaS",
  description:
    "Empower your gym with Gymcentrix – the premium SaaS for member management, real-time analytics, and seamless RFID sign-in.",
};

export default function HomePage() {
  return <LandingPage />;
}
