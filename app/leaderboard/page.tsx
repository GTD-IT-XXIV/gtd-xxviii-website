"use client";

import SiteShell from "@/components/SiteShell";
import { useEffect, useState } from "react";

type Status = "success" | "failed" | "waiting";

type Row = {
  teamName: string;
  captainName: string;
  members: string[];
  escapeTimeRaw: string;
  escapeTimeFormat: string;
  escapeTimeSeconds: number;
  status: Status;
};

export default function Page() {
  const [top3, setTop3] = useState<Row[]>([]);
  const [goodRows, setGoodRows] = useState<Row[]>([]);
  const [badRows, setBadRows] = useState<Row[]>([]);
  const [waitingRows, setWaitingRows] = useState<Row[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  function PodiumCard({
    r,
    rank,
    highlight,
  }: {
    r: Row;
    rank: number;
    highlight?: boolean;
  }) {
    return (
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-black/80
          ring-1 ${highlight ? "ring-[#ff4d4d]/35" : "ring-white/10"}
          shadow-2xl
          backdrop-blur
          p-6
        `}
      >
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#ff4d4d]/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#961818]/15 blur-3xl" />
        </div>

        <div className="relative z-10">
          <p className="text-xs tracking-widest text-white/60">#{rank}</p>

          <h3 className="mt-2 text-2xl text-white [font-family:var(--font-uncial)] tracking-widest">
            {r.teamName}
          </h3>

          <p className="mt-2 text-sm text-gray-300">
            Captain: <span className="text-white/90">{r.captainName}</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {r.members.slice(0, 6).map((m) => (
              <span
                key={m}
                className="text-xs text-white/80 px-2 py-1 rounded-full bg-black/40 ring-1 ring-white/10"
              >
                {m}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <p className="text-xs text-white/50 tracking-widest">ESCAPE TIME</p>
            <p
              className={`
                text-3xl text-white
                ${
                  highlight
                    ? "drop-shadow-[0_0_24px_rgba(255,77,77,0.55)]"
                    : "drop-shadow-[0_0_18px_rgba(255,77,77,0.35)]"
                }
              `}
            >
              {r.escapeTimeFormat}
            </p>
          </div>
        </div>
      </div>
    );
  }

  function StatusTable({
    title,
    glow,
    rows,
    showTime,
  }: {
    title: string;
    glow: "green" | "red" | "gray";
    rows: Row[];
    showTime: boolean;
  }) {
    const glowClass =
      glow === "green"
        ? "ring-1 ring-emerald-400/25 shadow-[0_0_40px_rgba(16,185,129,0.18)]"
        : glow === "red"
        ? "ring-1 ring-[#ff4d4d]/25 shadow-[0_0_40px_rgba(255,77,77,0.18)]"
        : "ring-1 ring-white/15 shadow-[0_0_40px_rgba(148,163,184,0.12)]";

    return (
      <div className="mt-15 mb-15">
        <div className="mb-4 flex items-center justify-center gap-5">
          <span className="relative h-[2px] w-24 md:w-44">
            <span className="absolute inset-0 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
            <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
          </span>
          <span className="text-white/90 tracking-widest text-sm">{title}</span>
          <span className="relative h-[2px] w-24 md:w-44">
            <span className="absolute inset-0 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
            <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
          </span>
        </div>

        <div className={`overflow-hidden rounded-2xl bg-black/35 backdrop-blur ${glowClass}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/40">
                <tr className="text-left text-white/70 tracking-widest text-xs">
                  <th className="px-5 py-4">RANK</th>
                  <th className="px-5 py-4">TEAM</th>
                  <th className="px-5 py-4">CAPTAIN</th>
                  <th className="px-5 py-4">MEMBERS</th>
                  <th className="px-5 py-4">STATUS</th>
                  {showTime && <th className="px-5 py-4">TIME</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {rows.map((r, i) => (
                  <tr key={`${r.teamName}-${i}`} className="text-gray-200">
                    <td className="px-5 py-4 text-white/70">{i + 1}</td>
                    <td className="px-5 py-4 text-white">{r.teamName}</td>
                    <td className="px-5 py-4 text-gray-300">{r.captainName}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {r.members.map((m) => (
                          <span
                            key={m}
                            className="text-xs text-white/80 px-2 py-1 rounded-full bg-black/40 ring-1 ring-white/10"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-xs tracking-widest px-2 py-1 rounded-full ring-1 whitespace-nowrap
                          ${
                            r.status === "success"
                              ? "text-emerald-200 ring-emerald-400/25 bg-emerald-400/10"
                              : r.status === "failed"
                              ? "text-red-200 ring-red-400/25 bg-red-400/10"
                              : "text-slate-200 ring-white/15 bg-white/5"
                          }
                        `}
                      >
                        {r.status}
                      </span>
                    </td>

                    {showTime && <td className="px-5 py-4 text-white/90">{r.escapeTimeFormat}</td>}
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-white/50" colSpan={showTime ? 6 : 5}>
                      No teams in this section yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load leaderboard");
        if (!alive) return;

        setTop3(data.top3 || []);
        setGoodRows(data.goodRows || []);
        setBadRows(data.badRows || []);
        setWaitingRows(data.waitingRows || []);
        setUpdatedAt(data.updatedAt || "");
        setErr("");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Something went wrong");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <SiteShell>
      <section className="relative isolate w-full min-h-screen bg-[#080808] overflow-hidden">
        {/* Full-screen hero background */}
        <div className="absolute inset-x-0 top-0 h-screen overflow-hidden">
          <div
            className="
              absolute inset-0
              bg-[url('/images/hero_bg.jpg')]
              bg-cover bg-center bg-no-repeat
              opacity-30
            "
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#080808]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1
              className="
                mt-16
                text-3xl sm:text-3xl md:text-5xl
                [font-family:var(--font-uncial)]
                tracking-widest
                text-white
                drop-shadow-[0_0_18px_rgba(255,77,77,0.35)]
              "
            >
              LEADERBOARD
            </h1>
          </div>

          {/* Top 3 Title */}
          <div className="mt-8 mb-4 flex items-center justify-center gap-5">
            <span className="relative h-[2px] w-24 md:w-44">
              <span className="absolute inset-0 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
              <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
            </span>
            <span className="text-white/90 tracking-widest text-[30px] md:text-[30px]">TOP 3</span>
            <span className="relative h-[2px] w-24 md:w-44">
              <span className="absolute inset-0 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
              <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
            </span>
          </div>

          {/* Loading / Error */}
          {loading && <div className="text-center text-gray-300">Summoning the times…</div>}

          {!!err && (
            <div className="mx-auto max-w-xl rounded-xl bg-black/40 ring-1 ring-red-500/25 p-5 text-center">
              <p className="text-white/90 tracking-widest text-sm">FAILED TO LOAD</p>
              <p className="mt-2 text-gray-300 text-sm">{err}</p>
              <p className="mt-3 text-white/50 text-xs">
                Check that the Google Sheet is published and the env vars are set.
              </p>
            </div>
          )}

          {/* Top 3 */}
          {!loading && !err && (
            <>
              {top3.length === 0 && (
                <div className="text-center text-white/70 mt-6 tracking-widest text-sm">
                  No winners yet
                </div>
              )}

              {/* Mobile */}
              <div className="grid grid-cols-1 gap-6 md:hidden">
                {top3.map((r, i) => (
                  <PodiumCard key={`${r.teamName}-${i}`} r={r} rank={i + 1} />
                ))}
              </div>

              {/* Desktop Podium */}
              <div className="hidden md:grid grid-cols-3 gap-8 items-end max-w-5xl mx-auto relative">
                {/* 2nd */}
                {top3[1] ? (
                  <div className="relative flex flex-col w-full">
                    <div className="h-10" />
                    <div
                      className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem]
                      bg-[radial-gradient(circle_at_center,rgba(192,192,192,0.28),rgba(192,192,192,0.12)_40%,transparent_70%)] blur-2xl"
                    />
                    <PodiumCard r={top3[1]} rank={2} />
                    <div
                      className="mt-4 w-full h-24 rounded-2xl
                      bg-gradient-to-b from-slate-300/20 via-black/35 to-black/60
                      ring-2 ring-slate-300/30
                      shadow-[0_0_30px_rgba(192,192,192,0.25)]
                      flex items-center justify-center text-white/80 font-medium"
                    >
                      2
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                {/* 1st */}
                {top3[0] ? (
                  <div className="relative flex flex-col w-full">
                    <div
                      className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem]
                      bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.35),rgba(255,215,0,0.15)_35%,transparent_70%)] blur-2xl"
                    />
                    <PodiumCard r={top3[0]} rank={1} highlight />
                    <div
                      className="mt-4 w-full h-32 rounded-2xl
                      bg-gradient-to-b from-amber-400/25 via-black/40 to-black/60
                      ring-2 ring-amber-400/40
                      shadow-[0_0_40px_rgba(255,215,0,0.35)]
                      flex items-center justify-center text-white font-semibold"
                    >
                      1
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                {/* 3rd */}
                {top3[2] ? (
                  <div className="relative flex flex-col w-full">
                    <div className="h-16" />
                    <div
                      className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem]
                      bg-[radial-gradient(circle_at_center,rgba(205,127,50,0.28),rgba(205,127,50,0.12)_40%,transparent_70%)] blur-2xl"
                    />
                    <PodiumCard r={top3[2]} rank={3} />
                    <div
                      className="mt-4 w-full h-16 rounded-2xl
                      bg-gradient-to-b from-orange-400/20 via-black/35 to-black/60
                      ring-2 ring-orange-400/30
                      shadow-[0_0_28px_rgba(205,127,50,0.25)]
                      flex items-center justify-center text-white/70 font-medium"
                    >
                      3
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </div>

              {/* Tables */}
              <StatusTable title="success" glow="green" rows={goodRows} showTime />
              <StatusTable title="failed" glow="red" rows={badRows} showTime />
              <StatusTable title="WAITING" glow="gray" rows={waitingRows} showTime={false} />
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}