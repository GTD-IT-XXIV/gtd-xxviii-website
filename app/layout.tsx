
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { Instagram, Linkedin, Music2 } from "lucide-react";


const uncialAntiqua = localFont({
  src: "../public/fonts/UncialAntiqua-Regular.ttf",
  variable: "--font-uncial",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={uncialAntiqua.variable}>
      <body className="min-h-screen flex flex-col">
        <header className="bg-[#961818] text-white">
          <nav className="w-full h-20 px-[60px] flex items-center justify-between">
            {/* Logo */}
             <Link href="/" aria-label="Go to homepage">
              <Image
                src="/images/white_logo.png"
                alt="My Logo"
                width={85}
                height={85}
                className="rounded-full cursor-pointer"
                priority
              />
            </Link>

            {/* Right links */}
            <div className="flex gap-10">
              <Link href="/" className="text-[22px] hover:opacity-70 hover:scale-115 transition-all duration-200 ease-out">
                Home
              </Link>
              <Link href="/register" className="text-[22px] hover:opacity-70 hover:scale-115 transition-all duration-200 ease-out">
                Register
              </Link>
              <Link href="/about" className="text-[22px] hover:opacity-70 hover:scale-115 transition-all duration-200 ease-out">
                About Us
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <div className="grid grid-cols-3 items-center">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="PINTU GTD Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
                <span className="font-semibold tracking-wide text-black">
                  PINTU GTD
                </span>
              </div>

              {/* CENTER */}
              <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} PINTU GTD. All Rights Reserved.
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-end gap-5 text-gray-600">
                <Link href="#" aria-label="TikTok" className="hover:text-black">
                  <Music2 className="h-5 w-5" />
                </Link>
                <Link href="#" aria-label="Instagram" className="hover:text-black">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" aria-label="LinkedIn" className="hover:text-black">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
