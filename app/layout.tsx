import "./globals.css";
import localFont from "next/font/local";

const uncialAntiqua = localFont({
  src: "../public/fonts/UncialAntiqua-Regular.ttf",
  variable: "--font-uncial",
});

export const metadata = {
  title: "PINTU GTD",
  description: "PINTU GTD Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${uncialAntiqua.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
