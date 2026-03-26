import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Gymcentrix | All-in-One Gym Management SaaS",
  description:
    "Empower your gym with Gymcentrix – the premium SaaS for member management, real-time analytics, and seamless RFID sign-in.",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = session.user as any;
    if (user.role === "SUPER_ADMIN") {
      redirect("/super-admin");
    } else if (user.role === "GYM_OWNER" || user.role === "EMPLOYEE") {
      redirect("/app");
    }
  }

  return <LandingPage />;
}
