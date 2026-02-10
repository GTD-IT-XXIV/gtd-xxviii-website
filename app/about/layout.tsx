import SiteShell from "@/components/SiteShell";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#120707] to-[#1e0a0a]" />
          <div className="absolute inset-0 bg-red-600/8" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_15%,rgba(239,68,68,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
          <div
              className="absolute inset-0 opacity-[0.03]
              [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),
                              linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
              [background-size:60px_60px]"
          />
          </div>

        {children}
      </div>
    </SiteShell>
  );
}
