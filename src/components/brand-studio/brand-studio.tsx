"use client";

import { useBrand } from "@/components/brand/brand-context";
import { DisabledHint } from "@/components/ui/ui-states";

export function BrandStudio() {
  const { brand, setBrand } = useBrand();

  return (
    <section className="space-y-4 rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-card backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase text-white/60">Gym brand identity</p>
          <h3 className="text-2xl font-semibold tracking-tight text-white">Brand Studio</h3>
          <p className="mt-1 text-xs text-white/50">Configure your gym logo and colors. The Gymcentrix app logo at the top of the panel cannot be changed here.</p>
        </div>
        <DisabledHint label="Save disabled until backend ready" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label className="text-sm text-white/60" htmlFor="gymName">
              Gym name
            </label>
            <input
              id="gymName"
              type="text"
              value={brand.gymName}
              onChange={(e) => setBrand({ gymName: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              placeholder="Your gym or business name"
            />
            <p className="mt-1 text-xs text-white/40">Shown in the sidebar below the app name, beside your gym logo.</p>
          </div>
          <div>
            <label className="text-sm text-white/60" htmlFor="logoUrl">
              Gym logo
            </label>
            <div className="mt-2 flex flex-col gap-3">
              <input
                id="logoUrl"
                type="text"
                value={brand.logoUrl}
                onChange={(event) => setBrand({ logoUrl: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                placeholder="/brand/your-gym-logo.png"
              />
              <p className="text-xs text-white/40">Shown beside your gym name in the sidebar. Enter image URL or path. Upload coming when backend is ready.</p>
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60" htmlFor="primaryColor">
              Primary color
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <input
                id="primaryColor"
                type="color"
                value={brand.primaryColor}
                onChange={(event) => setBrand({ primaryColor: event.target.value })}
                className="h-10 w-16 cursor-pointer rounded-2xl border border-white/10 bg-transparent"
              />
              <input
                type="text"
                value={brand.primaryColor}
                onChange={(event) => setBrand({ primaryColor: event.target.value })}
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60" htmlFor="secondaryColor">
              Secondary color
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <input
                id="secondaryColor"
                type="color"
                value={brand.secondaryColor}
                onChange={(event) => setBrand({ secondaryColor: event.target.value })}
                className="h-10 w-16 cursor-pointer rounded-2xl border border-white/10 bg-transparent"
              />
              <input
                type="text"
                value={brand.secondaryColor}
                onChange={(event) => setBrand({ secondaryColor: event.target.value })}
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white/60"
          >
            Save brand (coming soon)
          </button>
        </form>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/60">Live preview</p>
          <div
            className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 p-8"
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logoUrl}
                  alt="Gym logo"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-white/40">
                  No logo
                </div>
              )}
              <p className="text-center text-lg font-semibold text-white">{brand.gymName}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span
                className="rounded-xl px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Primary
              </span>
              <span
                className="rounded-xl px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: brand.secondaryColor }}
              >
                Secondary
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
