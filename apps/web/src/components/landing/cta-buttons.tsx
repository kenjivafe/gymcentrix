import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";

export function PrimaryCta({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-5 text-sm font-bold text-black hover:scale-105 active:scale-95 transition shadow-glow-strong uppercase tracking-widest"
    >
      {children}
      <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
    </Link>
  );
}

export function SecondaryCta({ 
  href, 
  children, 
}: { 
  href: Route; 
  children: React.ReactNode; 
}) {
  return (
    <Link
      href={href}
      className="inline-flex gap-2 items-center px-8 py-5 text-sm font-bold text-white rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition uppercase tracking-widest"
    >
      {children}
    </Link>
  );
}
