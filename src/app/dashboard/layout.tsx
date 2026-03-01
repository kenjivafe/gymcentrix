import { BrandProvider } from "@/components/brand/brand-context";
import { FeatureFlagsProvider } from "@/components/settings/feature-flags-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandProvider>
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    </BrandProvider>
  );
}
