import { Instagram, Send } from "lucide-react";

export default function Page() {
  return (
    <main>
      {/* Section 1: About Us */}
      <section className="min-h-[300px] flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
            About Us
        </h1>

        <p className="text-center text-gray-600 text-lg leading-relaxed max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat.
        </p>
        </section>

      <section className="px-6 py-10">
        <h2 className="text-4xl font-bold mb-10 text-center">FAQ</h2>

        <div className="mx-auto w-full max-w-4xl space-y-4">
            <details className="group rounded-xl border border-gray-200 bg-[#961818] p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                What is this website about?
                <span className="transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-3 text-gray-100 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
            </p>
            </details>

            <details className="group rounded-xl border border-gray-200 bg-[#961818] p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                How do I contact your team?
                <span className="transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-3 text-gray-100 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
            </p>
            </details>

            <details className="group rounded-xl border border-gray-200 bg-[#961818] p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                Is there a cost to use this service?
                <span className="transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-3 text-gray-100 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi ut aliquip ex ea commodo consequat.
            </p>
            </details>
        </div>
        </section>


       <section className="min-h-[400px] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-10">
            {/* Title */}
            <h2 className="text-center text-4xl font-bold text-white">
            Get in Touch
            </h2>
            <p className="mt-3 text-center text-white/70">
            Have questions? Reach out to us through our social media channels.
            </p>

            {/* Cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Instagram */}
            <a
                href="https://instagram.com/pintugtd"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <Instagram className="h-6 w-6 text-white/90" />
                </div>

                <div>
                <div className="text-white font-semibold">Instagram</div>
                <div className="text-white/60 text-sm">@pintugtd</div>
                </div>
            </a>

            {/* Telegram */}
            <a
                href="https://t.me/sherynwu"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <Send className="h-6 w-6 text-white/90" />
                </div>

                <div>
                <div className="text-white font-semibold">Telegram</div>
                <div className="text-white/60 text-sm">@sherynwu</div>
                </div>
            </a>
            </div>
        </div>
        </section>

    </main>
  );
}