import { Instagram, Send } from "lucide-react";

export default function Page() {
  return (
    <main>
      <section className="relative mt-10 px-6 py-4 overflow-hidden">

        <div className="relative mx-auto w-full max-w-4xl">
            {/* Eyebrow */}
            <div className="mx-auto mb-4 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[0.28em] text-white/70">
            MISSION BRIEFING
            </div>

            {/* Title */}
            <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">
            About{" "}
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]">
                Us
            </span>
            </h1>

            {/* Divider */}
            <div className="mx-auto mt-6 h-px w-44 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Dossier Card */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur">
            {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="text-sm font-semibold tracking-wide text-white/90">
                    FILE: GTD / ARCANEX
                    </div>
                    <div className="text-xs text-white/60">
                    STATUS: <span className="text-red-400">ACTIVE</span>
                    </div>
                </div>

                <div className="px-6 py-7 md:px-10 md:py-9">
                    <div className="space-y-8">
                        <div>
                            <h2 className="mb-2 text-xs font-semibold tracking-[0.22em] text-white/80">
                            WHO WE ARE
                            </h2>
                            <p className="text-center md:text-left text-white/70 text-base md:text-lg leading-relaxed">
                            Get Together Day (GTD) is an annual orientation camp organized under
                            PINTU (Indonesian Students Community in Nanyang Technological
                            University) to warmly welcome new Indonesian students into our
                            community.
                            </p>
                        </div>

                        <div>
                            <h2 className="mb-2 text-xs font-semibold tracking-[0.22em] text-white/80">
                            OUR PURPOSE
                            </h2>
                            <p className="text-center md:text-left text-white/70 text-base md:text-lg leading-relaxed">
                            The event helps freshmen adjust to life in Singapore while
                            fostering meaningful connections between new students and seniors
                            in a friendly, supportive environment.
                            </p>
                        </div>

                        <div>
                            <h2 className="mb-2 text-xs font-semibold tracking-[0.22em] text-white/80">
                            ARCANEX: ESCAPE ROOM EXPERIENCE
                            </h2>
                            <p className="text-center md:text-left text-white/70 text-base md:text-lg leading-relaxed">
                            GTD also strengthens bonds among Indonesian students at NTU. This
                            escape room POLOG Project “ARCANEX” is designed as a fun,
                            collaborative game where participants solve challenges and connect
                            through shared experiences that bring the community closer.
                            </p>
                        </div>

                        {/* Callout */}
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4">
                            <p className="text-center md:text-left text-white/85 text-base">
                            Enter with your team, leave with new friends — and (hopefully) the
                            final key.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Small stats row */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
                ["Theme", "Escape Room"],
                ["Community", "PINTU @ GTD"],
                ["Project", "ARCANEX"],
            ].map(([k, v]) => (
                <div
                key={k}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center"
                >
                    <div className="text-xs tracking-[0.18em] text-white/55">{k}</div>
                    <div className="mt-1 text-base font-semibold text-white/85">{v}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>  

    <section className="relative px-6 py-14 mt-10 overflow-hidden">
    
        <div className="relative mx-auto w-full max-w-4xl">
            {/* Eyebrow */}
            <div className="mx-auto mb-4 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[0.28em] text-white/70">
            ARCHIVE
            </div>

            {/* Title */}
            <h2 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">
            FAQ{" "}
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]">
                </span>
            </h2>

            {/* Divider */}
            <div className="mx-auto mt-6 h-px w-44 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Dossier card wrapper */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="text-sm font-semibold tracking-wide text-white/90">
                    FILE: ARCANEX / FAQ
                    </div>
                    <div className="text-xs text-white/60">
                    CLEARANCE: <span className="text-red-400">PUBLIC</span>
                    </div>
                </div>

                <div className="px-4 py-5 md:px-6 md:py-7 space-y-4">
                    {/* ITEM 1 */}
                    <details className="group rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-red-500/30 hover:bg-black/55 hover:shadow-[0_0_24px_rgba(239,68,68,0.10)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white/90">
                        <span className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
                        Who can join the escape room?
                        </span>
                        <span className="text-red-300 transition-transform duration-200 group-open:rotate-180">⌄</span>
                    </summary>

                    <div className="mt-4">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                            <p className="mt-4 text-white/70 leading-relaxed">
                            The Polog Project “ARCANEX” is open to all Indonesian students at NTU.
                            Freshie and senior are more than welcome to join the fun.
                            </p>
                        </div>
                    </details>

                    {/* ITEM 2 */}
                    <details className="group rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-red-500/30 hover:bg-black/55 hover:shadow-[0_0_24px_rgba(239,68,68,0.10)]">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white/90">
                            <span className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
                                How long does one game session take?
                                </span>
                            <span className="text-red-300 transition-transform duration-200 group-open:rotate-180">⌄</span>
                        </summary>

                        <div className="mt-4">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                            <p className="mt-4 text-white/70 leading-relaxed">
                            Each session runs for around 120 minutes. Participants may choose their
                            preferred time slot based on their team’s availability.
                            </p>
                        </div>
                    </details>

                    {/* ITEM 3 */}
                    <details className="group rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-red-500/30 hover:bg-black/55 hover:shadow-[0_0_24px_rgba(239,68,68,0.10)]">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white/90">
                            <span className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
                                How many people are in one team?
                                </span>
                            <span className="text-red-300 transition-transform duration-200 group-open:rotate-180">⌄</span>
                        </summary>

                        <div className="mt-4">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                            <p className="mt-4 text-white/70 leading-relaxed">
                            Each team ideally consists of 4 to 6 participants, with a maximum of 6 players
                            and a minimum of 4 players. Each team must appoint 1 team captain.
                            </p>
                        </div>
                    </details>

                    {/* ITEM 4 */}
                    <details className="group rounded-xl border border-white/10 bg-black/40 p-5 transition hover:border-red-500/30 hover:bg-black/55 hover:shadow-[0_0_24px_rgba(239,68,68,0.10)]">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-white/90">
                            <span className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
                                What should I prepare before joining?
                                </span>
                            <span className="text-red-300 transition-transform duration-200 group-open:rotate-180">⌄</span>
                        </summary>

                        <div className="mt-4">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                            <p className="mt-4 text-white/70 leading-relaxed">
                            No special preparation is required. Participants are encouraged to come on time,
                            follow the instructions, and be ready to work together as a team.
                            </p>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </section>

    <section className="relative min-h-[420px] flex items-center justify-center px-6 py-16 overflow-hidden">
        <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur p-10">
            {/* Top bar */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-sm font-semibold tracking-wide text-white/90">
                COMMUNICATION TERMINAL
            </div>
            <div className="text-xs text-white/60">
                STATUS: <span className="text-red-400">ONLINE</span>
            </div>
            </div>

            {/* Title */}
            <h2 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Get in{" "}
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]">
                Touch
            </span>
            </h2>

            <p className="mt-3 text-center text-white/70 max-w-2xl mx-auto">
            Have questions? Reach out to us through our official communication channels.
            </p>

            {/* Cards */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Instagram */}
            <a
                href="https://instagram.com/pintugtd"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5 rounded-xl border border-white/10 bg-black/40 p-6 transition
                        hover:border-red-500/30 hover:bg-black/55
                        hover:shadow-[0_0_28px_rgba(239,68,68,0.12)]"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black">
                <Instagram className="h-6 w-6 text-white/90 group-hover:text-red-400 transition" />
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
                className="group flex items-center gap-5 rounded-xl border border-white/10 bg-black/40 p-6 transition
                        hover:border-red-500/30 hover:bg-black/55
                        hover:shadow-[0_0_28px_rgba(239,68,68,0.12)]"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black">
                <Send className="h-6 w-6 text-white/90 group-hover:text-red-400 transition" />
                </div>

                <div>
                <div className="text-white font-semibold">Telegram</div>
                <div className="text-white/60 text-sm">@sherynwu</div>
                </div>
            </a>
            </div>

            {/* Footer hint */}
            <div className="mt-10 text-center text-xs tracking-[0.22em] text-white/50">
            RESPONSE TIME MAY VARY · PLEASE STAND BY
            </div>
        </div>
    </section>

    </main>
  );
}