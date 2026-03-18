"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BrandState = {
  systemName: string;
  gymName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
};

const defaultBrand: BrandState = {
  systemName: "Gymcentrix",
  gymName: "Elevate Lifestyle & Fitness",
  logoUrl: "/brand/elevate-logo.png",
  primaryColor: "#87f100",
  secondaryColor: "#f97316",
};

type BrandContextValue = {
  brand: BrandState;
  setBrand: (partial: Partial<BrandState>) => void;
};

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrandState] = useState<BrandState>(defaultBrand);

  const setBrand = useCallback((partial: Partial<BrandState>) => {
    setBrandState((prev) => ({ ...prev, ...partial }));
  }, []);

  const value = useMemo(() => ({ brand, setBrand }), [brand, setBrand]);

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
}
