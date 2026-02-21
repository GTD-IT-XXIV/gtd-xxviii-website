"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Music2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass = (href: string) => {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/");

    return `
      relative text-base md:text-[22px] transition-all duration-200 ease-out
      md:hover:opacity-70 md:hover:scale-110
      after:absolute after:left-0 after:-bottom-1
      after:h-[2px] after:transition-all after:duration-300
      ${
        isActive
          ? "text-[#961818] after:w-full after:bg-[#961818] md:scale-110"
          : "text-white after:w-0 after:bg-white md:hover:after:w-full"
      }
    `;
  };

  return (
    <>
      {/* HEADER */}
      <header
          className="
            sticky top-0 z-[100]
            bg-[#0a0a0a] text-white
          "
        >
          <nav
            className={`
              relative
              w-full h-20
              px-4 sm:px-8 md:px-[60px]
              flex items-center
            `}
          >
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src="/images/white_logo.png"
                  alt="My Logo"
                  width={85}
                  height={85}
                  className={`
                    rounded-full cursor-pointer
                    w-[56px] h-[56px]
                    sm:w-[72px] sm:h-[72px]
                  `}
                  priority
                />
              </Link>
            </div>

            {/* Center: Desktop tabs (centered) */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex gap-10 items-center">
                <Link href="/" className={linkClass("/")}>
                  Home
                </Link>

                <Link href="/register" className={linkClass("/register")}>
                  Register
                </Link>

                <Link href="/about" className={linkClass("/about")}>
                  About Us
                </Link>
              </div>
            </div>

            {/* Right: spacer to keep center truly centered (matches logo width area) */}
            <div className="hidden md:block shrink-0 w-[72px]" />

            {/* Mobile: hamburger */}
            <div className="ml-auto md:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className={`
                  md:hidden
                  inline-flex items-center justify-center
                  rounded-xl
                  w-11 h-11
                  bg-white/5
                  ring-1 ring-white/15
                  backdrop-blur
                  transition-all duration-200
                  active:scale-[0.98]
                  ${mobileOpen ? "bg-white/10 ring-white/25" : "hover:bg-white/10"}
                `}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <span className="relative block w-6 h-6">
                  <span
                    className={`
                      absolute left-0 top-[6px] h-[2px] w-6 bg-white/90
                      transition-transform duration-200
                      ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}
                    `}
                  />
                  <span
                    className={`
                      absolute left-0 top-[12px] h-[2px] w-6 bg-white/90
                      transition-opacity duration-200
                      ${mobileOpen ? "opacity-0" : "opacity-100"}
                    `}
                  />
                  <span
                    className={`
                      absolute left-0 top-[18px] h-[2px] w-6 bg-white/90
                      transition-transform duration-200
                      ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}
                    `}
                  />
                </span>
              </button>
            </div>

            {/* Mobile dropdown */}
            <div
              className={`
                md:hidden
                absolute left-4 right-4 top-[76px]
                rounded-xl
                bg-[#0a0a0a]
                ring-1 ring-white/15
                shadow-[0_18px_50px_rgba(0,0,0,0.65)]
                backdrop-blur
                overflow-hidden
                transition-all duration-300 ease-out
                ${mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
              `}
            >
              <div className="flex flex-col py-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base text-white/90 hover:bg-white/5"
                >
                  Home
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base text-white/90 hover:bg-white/5"
                >
                  Register
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base text-white/90 hover:bg-white/5"
                >
                  About Us
                </Link>
              </div>
            </div>
          </nav>
        </header>

      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center">
              {/* LEFT */}
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Image
                  src="/images/black_logo.png"
                  alt="PINTU GTD Logo"
                  width={110}
                  height={110}
                  className="object-contain w-11 h-11 scale-180 origin-right"
                />
                <span className="font-semibold tracking-wide text-black">PINTU GTD</span>
              </div>

              {/* CENTER */}
              <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} PINTU GTD. All Rights Reserved.
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-center sm:justify-end gap-5 text-gray-600">
                <Link href="https://www.tiktok.com/@pintugtd" aria-label="TikTok" className="hover:text-black" target="_blank" rel="noopener noreferrer">
                  <Music2 className="h-5 w-5" />
                </Link>
                <Link href="https://www.instagram.com/pintugtd" aria-label="Instagram" className="hover:text-black" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://www.linkedin.com/company/pintu-gtd/" aria-label="LinkedIn" className="hover:text-black" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
    </>
  );
}
