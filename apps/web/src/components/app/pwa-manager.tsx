"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface PWAContextValue {
  canInstall: boolean;
  isUpdateAvailable: boolean;
  promptInstall: () => Promise<void>;
  applyUpdate: () => void;
}

const PWAContext = createContext<PWAContextValue>({
  canInstall: false,
  isUpdateAvailable: false,
  promptInstall: async () => {},
  applyUpdate: () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}

export function PWAManager({ children }: { children?: React.ReactNode }) {
  const [canInstall, setCanInstall] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const deferredPrompt = useRef<any>(null);
  const waitingSW = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js", { scope: "/app/" })
      .then((registration) => {
        // Check for an existing waiting SW (e.g., page refreshed after update)
        if (registration.waiting) {
          waitingSW.current = registration.waiting;
          setIsUpdateAvailable(true);
        }

        // Listen for a new SW entering the waiting state
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              waitingSW.current = newWorker;
              setIsUpdateAvailable(true);
            }
          });
        });

        // Reload once the new SW has taken control
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });
      })
      .catch((err) => {
        console.error("[PWA] Service worker registration failed:", err);
      });

    // Capture install prompt
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // Hide install button once installed
    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      deferredPrompt.current = null;
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
      deferredPrompt.current = null;
    }
  };

  const applyUpdate = () => {
    if (!waitingSW.current) return;
    waitingSW.current.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <PWAContext.Provider
      value={{ canInstall, isUpdateAvailable, promptInstall, applyUpdate }}
    >
      {children}
    </PWAContext.Provider>
  );
}
