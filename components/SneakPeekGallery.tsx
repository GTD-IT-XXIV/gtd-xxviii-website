"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type SneakPeekGalleryProps = {
  coverSrc: string;
  coverAlt?: string;

  coverLogoSrc?: string;
  coverLogoAlt?: string;

  coverTitle?: string;
  coverDescription?: string;
  coverCta?: string;
  coverType?: string;

  photos: string[];
  defaultRevealed?: boolean;

  autoAdvanceMs?: number;
  pauseAfterManualMs?: number;
  fadeMs?: number;
};

export function SneakPeekGallery({
  coverSrc,
  coverAlt = "Gallery cover",

  coverLogoSrc,
  coverLogoAlt = "Logo",

  coverTitle = "PAST EVENTS",
  coverDescription = "Take a look at highlights from our previous events.",
  coverCta = "Click to see more",
  coverType = "",

  photos,
  defaultRevealed = false,

  autoAdvanceMs = 5000,
  pauseAfterManualMs = 5000,
  fadeMs = 260,
}: SneakPeekGalleryProps) {
  const safePhotos = useMemo(() => photos.filter(Boolean), [photos]);

  const [active, setActive] = useState(0);
  const [lastManualAt, setLastManualAt] = useState<number>(0);

  // per-photo fade
  const [fading, setFading] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);

  // cover <-> gallery crossfade
  const [isSwitching, setIsSwitching] = useState(false);
  const [phase, setPhase] = useState<"cover" | "gallery">(
    defaultRevealed ? "gallery" : "cover"
  );

  const TRANSITION_MS = 650;

  const loopPhotos = useMemo(() => [...safePhotos, ...safePhotos], [safePhotos]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const goTo = (nextIdx: number) => {
    if (safePhotos.length === 0) return;
    if (nextIdx === active) return;

    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

    setFading(true);
    fadeTimerRef.current = window.setTimeout(() => {
      setActive(nextIdx);
      setFading(false);
    }, fadeMs);
  };

  const revealGallery = () => {
    if (isSwitching) return;
    setIsSwitching(true);
    setPhase("gallery");
    window.setTimeout(() => setIsSwitching(false), TRANSITION_MS);
  };

  const hideGallery = () => {
    if (isSwitching) return;
    setIsSwitching(true);
    setPhase("cover");
    window.setTimeout(() => setIsSwitching(false), TRANSITION_MS);
  };

  // auto-advance only when gallery is showing
  useEffect(() => {
    if (phase !== "gallery") return;
    if (safePhotos.length <= 1) return;

    const interval = window.setInterval(() => {
      const now = Date.now();
      if (now - lastManualAt < pauseAfterManualMs) return;
      goTo((active + 1) % safePhotos.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(interval);
  }, [phase, safePhotos.length, lastManualAt, active, autoAdvanceMs, pauseAfterManualMs]);

  const onPick = (idx: number) => {
    setLastManualAt(Date.now());
    goTo(idx);
  };

  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 15%"],
  });

  const settle = useTransform(scrollYProgress, [0, 0.45], [0, 1], { clamp: true });

  // 3D card feel
  const rotateX = useTransform(settle, [0, 1], [22, 0]);
  const y = useTransform(settle, [0, 1], [48, 0]);
  const scale = useTransform(settle, [0, 1], [0.965, 1]);
  const blur = useTransform(settle, [0, 1], [1.5, 0]);
  const shadowBoost = useTransform(settle, [0, 1], [0.55, 1]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const boxShadow = useTransform(shadowBoost, (s) => {
    const alpha = 0.45 * s;
    return `0 25px 70px rgba(0,0,0,${alpha})`;
  });

  return (
    <section
      ref={sectionRef as any}
      className={`
        w-full bg-[#080808]
        px-4 sm:px-6 py-4
      `}
    >
      <div className={``}>
        <div className={`mx-auto max-w-6xl`}>
          <motion.div
            className={`
              relative
              aspect-[4/5] sm:aspect-[16/9]
              w-full
              overflow-hidden
              rounded-2xl shadow-2xl
              ring-1 ring-white/10
            `}
            style={
              reduceMotion
                ? undefined
                : {
                    transformPerspective: 1200,
                    rotateX,
                    y,
                    scale,
                    filter,
                    boxShadow,
                    willChange: "transform, filter",
                  }
            }
          >
            {/* COVER LAYER */}
            <div
              className={`
                absolute inset-0
                transition-opacity duration-[650ms] ease-out
                ${phase === "cover" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
              `}
            >
              <Image
                src={coverSrc}
                alt={coverAlt}
                fill
                priority
                className={`
                  object-cover
                `}
              />
              <div className={`absolute inset-0 bg-black/55`} />
              <div
                className={`
                  absolute inset-0
                  [background:radial-gradient(70%_60%_at_70%_50%,rgba(255,255,255,0.10),transparent_65%)]
                `}
              />
              <div
                className={`
                  pointer-events-none absolute inset-0
                  rounded-2xl
                  ring-2 ring-inset ring-white/15
                  z-20
                `}
              />

              {/* On mobile we lay content out from the top with tighter spacing.
                  On sm+ it goes back to your centered desktop layout. */}
              <div
                className={`
                  absolute inset-0
                  flex
                  items-start pt-5
                  sm:items-center sm:pt-0
                `}
              >
                <div className={`w-full px-4 sm:px-6 md:px-10`}>
                  <div
                    className={`
                      grid gap-4
                      sm:gap-8
                      md:grid-cols-2 md:gap-12
                      items-center
                    `}
                  >
                    {/* LEFT: logo */}
                    <div className={`flex justify-center`}>
                      <div
                        className={`
                          relative aspect-square
                          w-[clamp(110px,36vw,170px)]
                          sm:w-[clamp(220px,45vw,520px)]
                          md:w-[clamp(320px,28vw,620px)]
                        `}
                      >
                        {coverLogoSrc ? (
                          <Image
                            src={coverLogoSrc}
                            alt={coverLogoAlt}
                            fill
                            className={`
                              object-contain
                              drop-shadow-[0_0_22px_rgba(0,0,0,0.7)]
                            `}
                          />
                        ) : (
                          <div className={`absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20`} />
                        )}
                      </div>
                    </div>

                    {/* RIGHT: text + button */}
                    <div className={`flex flex-col items-center text-center`}>
                      <p
                        className={`
                          [font-family:Tangak]
                          text-[clamp(1.15rem,6.2vw,1.8rem)]
                          sm:text-[clamp(2.5rem,3vw,5.75rem)]
                          text-red-300
                          drop-shadow-[0_0_18px_rgba(0,0,0,0.6)]
                          leading-tight
                          break-words
                          max-w-[92%]
                        `}
                      >
                        {coverType}
                      </p>

                      <h2
                        className={`
                          [font-family:Tangak]
                          text-[clamp(1.6rem,9vw,2.5rem)]
                          sm:text-[clamp(2.5rem,6vw,5.75rem)]
                          leading-[0.94]
                          text-white/95
                          drop-shadow-[0_0_18px_rgba(0,0,0,0.6)]
                          break-words
                          max-w-[92%]
                        `}
                      >
                        {coverTitle}
                      </h2>

                      {coverDescription && (
                        <p
                          className={`
                            mt-2
                            max-w-xl
                            text-xs sm:text-sm md:text-base
                            text-white/75
                            leading-relaxed
                          `}
                        >
                          {coverDescription}
                        </p>
                      )}

                      {/* Mobile guarantee: button always visible inside the taller aspect */}
                      <button
                        type="button"
                        onClick={revealGallery}
                        disabled={isSwitching}
                        className={`
                          mt-3 sm:mt-6
                          rounded-xl
                          px-5 py-2.5 sm:px-6 sm:py-3
                          w-full max-w-[260px]
                          bg-[#961818]/80 hover:bg-[#961818]
                          ring-1 ring-white/20 hover:ring-white/35
                          text-white font-semibold
                          transition-all duration-300
                          hover:scale-105
                          active:scale-[0.98]
                          ${isSwitching ? "opacity-60 pointer-events-none" : ""}
                        `}
                      >
                        {coverCta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`
                  pointer-events-none absolute inset-x-0 bottom-0 h-20
                  bg-gradient-to-b from-transparent to-[#080808]
                `}
              />
            </div>

            {/* GALLERY MAIN IMAGE LAYER */}
            <div
              className={`
                absolute inset-0
                transition-opacity duration-[650ms] ease-out
                ${phase === "gallery" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
              `}
            >
              {safePhotos.length > 0 ? (
                <>
                  <div
                    className={`
                      absolute inset-0
                      transition-opacity duration-300
                      ${fading ? "opacity-30" : "opacity-100"}
                    `}
                  >
                    <Image
                      src={safePhotos[active]}
                      alt={`Event photo ${active + 1}`}
                      fill
                      priority
                      className={`
                        object-cover
                      `}
                    />
                    <div className={`absolute inset-0 bg-black/15`} />
                  </div>

                  <div
                    className={`
                      absolute bottom-3 left-3 sm:bottom-4 sm:left-4
                      rounded-lg bg-black/45
                      px-3 py-2
                      text-xs sm:text-sm
                      text-white/90 backdrop-blur
                      max-w-[70%]
                    `}
                  >
                    Previous Events • {active + 1}/{safePhotos.length}
                  </div>

                  <button
                    type="button"
                    onClick={hideGallery}
                    disabled={isSwitching}
                    className={`
                      absolute bottom-3 right-3 sm:bottom-4 sm:right-4
                      rounded-lg bg-black/45
                      px-3 py-2
                      text-xs sm:text-sm
                      text-white/90
                      ring-1 ring-white/10 hover:ring-white/25
                      backdrop-blur transition
                      ${isSwitching ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >
                    Hide
                  </button>
                </>
              ) : (
                <div className={`absolute inset-0 grid place-items-center text-white/70`}>
                  No photos provided.
                  <button
                    type="button"
                    onClick={hideGallery}
                    className={`ml-3 underline hover:text-white`}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* THUMBNAILS only when gallery is active */}
          <div
            className={`
              mt-6
              transition-opacity duration-[650ms] ease-out
              ${phase === "gallery" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            {safePhotos.length > 0 && (
              <div className={`relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/20`}>
                <div
                  className={`
                    pointer-events-none absolute inset-y-0 left-0
                    w-10 sm:w-16
                    bg-gradient-to-r from-[#080808] to-transparent
                    z-10
                  `}
                />
                <div
                  className={`
                    pointer-events-none absolute inset-y-0 right-0
                    w-10 sm:w-16
                    bg-gradient-to-l from-[#080808] to-transparent
                    z-10
                  `}
                />

                <div className={`group`}>
                  <div
                    className={`
                      flex gap-3 sm:gap-4
                      py-3 sm:py-4
                      px-3 sm:px-4
                      w-max
                      animate-thumbscroll
                      group-hover:[animation-play-state:paused]
                    `}
                  >
                    {loopPhotos.map((src, i) => {
                      const idx = i % safePhotos.length;
                      const isActive = idx === active;

                      return (
                        <button
                          key={`${src}-${i}`}
                          type="button"
                          onClick={() => onPick(idx)}
                          className={`
                            relative
                            h-16 w-28
                            sm:h-20 sm:w-32
                            md:h-24 md:w-40
                            shrink-0 overflow-hidden rounded-xl
                            ring-1 transition-all duration-200
                            ${isActive ? "ring-[#ff4d4d]/70" : "ring-white/10 hover:ring-white/30"}
                          `}
                          aria-label={`Show photo ${idx + 1}`}
                        >
                          <Image
                            src={src}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className={`
                              object-cover transition-all duration-300
                              ${isActive ? "brightness-110" : "brightness-90 hover:brightness-110"}
                            `}
                          />
                          <div className={`absolute inset-0 bg-black/10`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes thumbscroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
            .animate-thumbscroll {
              animation: thumbscroll 28s linear infinite;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
