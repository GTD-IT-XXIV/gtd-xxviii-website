import SiteShell from "@/components/SiteShell";
import { RegisterProvider } from "@/components/register/RegisterProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <SiteShell>
        <RegisterProvider>
          <div className="relative min-h-screen">
            <div
              className="
                absolute inset-0
                bg-[url('/images/hero_bg.jpg')]
                bg-cover bg-center bg-no-repeat
                opacity-15
                pointer-events-none
              "
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-[#0a0a0a]" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
            </div>

            <div className="absolute inset-0 bg-black/20" />
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </RegisterProvider>
      </SiteShell>
    );
}