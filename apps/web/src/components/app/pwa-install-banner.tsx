"use client";

import { useEffect, useState } from "react";
import { Download, X, RefreshCw, Smartphone } from "lucide-react";
import { usePWA } from "./pwa-manager";

const DISMISSED_KEY = "gymcentrix_pwa_install_dismissed";

export function PWAInstallBanner() {
  const { canInstall, isUpdateAvailable, promptInstall, applyUpdate } =
    usePWA();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Read localStorage only on client
    const wasDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    setDismissed(wasDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  const handleInstall = async () => {
    await promptInstall();
  };

  const handleUpdate = () => {
    setUpdating(true);
    applyUpdate();
  };

  // ── Update available banner (always shown, regardless of dismiss state) ──
  if (isUpdateAvailable) {
    return (
      <div
        role="alert"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-[#0d1e00]/90 backdrop-blur-xl px-5 py-4 shadow-[0_0_40px_-8px_rgba(135,241,0,0.3)]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <RefreshCw className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight">
              New version available
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              Reload to get the latest Gymcentrix update.
            </p>
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={updating}
            className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-black text-black hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {updating ? "Reloading…" : "Reload"}
          </button>
        </div>
      </div>
    );
  }

  // ── Install prompt banner ──
  if (!canInstall || dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Install Gymcentrix app"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111111]/90 backdrop-blur-xl px-5 py-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Smartphone className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            Install Gymcentrix
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            Add to your home screen for quick access.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-black hover:bg-primary/90 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
