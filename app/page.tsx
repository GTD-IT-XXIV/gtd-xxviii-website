"use client";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import { SneakPeekGallery } from "@/components/SneakPeekGallery";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [cinematic, setCinematic] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    };
  }, []);

  const tryPlay = async () => {
    const v = videoRef.current;
    if (!v) return false;

    try {
      v.playsInline = true;
      v.preload = "auto";

      v.muted = true;
      v.volume = 0.5;
      v.currentTime = 0;

      await v.play();

      setMuted(true);
      return true;
    } catch {
      return false;
    }
  };

  const startCinematic = async () => {
    if (cinematic || exiting) return;

    setExiting(true);

    const ok = await tryPlay();
    if (!ok) {
      setNeedsTap(true);
      setCinematic(true);
      setExiting(false);
      return;
    }

    setNeedsTap(false);
    setCinematic(true);
  };

  const endCinematicWithHold = () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);

    holdTimerRef.current = window.setTimeout(() => {
      setNeedsTap(false);
      setCinematic(false);
      setMuted(true);

      window.setTimeout(() => {
        setExiting(false);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, 650);
    }, 2000);
  };

  const tapToPlay = (e?: any) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const v = videoRef.current;
    if (!v) return;

    setCinematic(true);

    v.playsInline = true;
    v.muted = true;
    v.volume = 0.5;
    v.currentTime = 0;

    v.load();

    setNeedsTap(false);

    const p = v.play();
    if (!p) return;

    p.then(() => {
      setMuted(true);
      setExiting(true);
    }).catch((err) => {
      console.log("play() failed:", err?.name, err?.message, err);
      setNeedsTap(true);
    });
  };


  const skipCinematic = () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setCinematic(false);
    setMuted(true);

    window.setTimeout(() => {
      setExiting(false);
    }, 650);
  };

  return (
    <SiteShell>
      <section className="group relative isolate w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className={`
            absolute inset-0
            bg-[url('/images/hero_bg.jpg')]
            bg-cover bg-center bg-no-repeat
            opacity-45
            transition-opacity duration-300

            group-has-[a:hover]:opacity-15

            [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
            [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
          `}
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          <div className="absolute inset-x-0 top-0 h-30 bg-gradient-to-t from-transparent to-[#0a0a0a]" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        </div>

        <div className="absolute inset-0 bg-black/20" />

        {/* Video overlay */}
        {needsTap && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/30"
            onTouchEnd={tapToPlay}
            onClick={tapToPlay}
          >
            <button
              type="button"
              onTouchEnd={tapToPlay}
              onClick={tapToPlay}
              className="
                px-8 py-4 rounded-xl
                bg-black/60 text-white
                ring-1 ring-white/25
                backdrop-blur
                text-sm tracking-widest
                hover:bg-black/75
                active:scale-[0.98]
              "
            >
              TAP TO PLAY
            </button>
          </div>
        )}
        <div
          className={`
            absolute inset-0 z-20
            transition-opacity ease-out
            ${(cinematic || needsTap) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          style={{ transitionDuration: (cinematic || needsTap) ? "900ms" : "1400ms" }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={"/videos/Fight%20Scene_ios.mp4"}
            playsInline
            preload="auto"
            poster="/images/hero_bg.jpg"
            onEnded={endCinematicWithHold}
            muted
          />

          <button
            type="button"
            onClick={skipCinematic}
            className="
              absolute top-6 right-6 z-30
              px-5 py-3 rounded-lg
              bg-black/50 text-white/90 text-sm tracking-widest
              ring-1 ring-white/20
              backdrop-blur
              transition-all duration-300 ease-out
              hover:bg-black/70 hover:scale-105 hover:ring-white/40
            "
          >
            SKIP
          </button>
          {cinematic && muted && (
            <button
              type="button"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;

                v.muted = false;
                v.volume = 0.5;
                setMuted(false);
              }}
              className="
                absolute top-6 left-6 z-40
                px-4 py-2 rounded-lg
                bg-black/50 text-white/90 text-xs tracking-widest
                ring-1 ring-white/20
                backdrop-blur
                transition-all duration-300
                hover:bg-black/70
              "
            >
              🔊 UNMUTE
            </button>
          )}

          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center">
          <div
            className="
              absolute
              -top-46 sm:-top-46 md:-top-62
              left-1/2
              -translate-x-1/2
              pointer-events-none
              transition-all
              duration-700
            "
          >
            <Image
              src="/images/arcanex logo (without text).png"
              alt="Arcanex Logo"
              width={400}
              height={400}
              className="
                w-[55vw]
                max-w-[260px]
                sm:w-[40vw]
                sm:max-w-[320px]
                md:max-w-[350px]
                h-auto
                drop-shadow-[0_0_20px_rgba(255,77,77,0.45)]
              "
              priority
            />
          </div>

          {/* Title (clickable) */}
          <button
            type="button"
            onClick={startCinematic}
            className={`
              text-5xl sm:text-6xl md:text-7xl lg:text-8xl
              [font-family:var(--font-uncial)]
              text-white
              cursor-pointer
              focus:outline-none
              transition-all
              ${exiting ? "scale-[3.4] opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0"}
              hover:scale-135
              hover:text-[#ff4d4d]
              hover:drop-shadow-[0_0_25px_rgba(255,77,77,0.7)]
            `}
            style={{
              transitionDuration: exiting ? "1400ms" : "900ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            aria-label="Play cinematic intro"
          >
            ARCANEX
          </button>

          <div
            className={`
              transition-all ease-out
              ${exiting ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}
            `}
            style={{
              transitionDuration: exiting ? "900ms" : "1200ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <p className="mt-5 text-base sm:text-lg md:text-[22px] text-gray-300">28 February – 1 March</p>

            <Link
              href="/register"
              className="
                mt-10 inline-block
                px-7 py-3 text-base sm:px-10 sm:py-4 sm:text-lg
                bg-[#961818]
                text-white text-lg tracking-widest
                rounded-lg
                transition-all duration-400 ease-out
                hover:scale-110
                hover:shadow-[0_0_20px_rgba(255,77,77,0.6)]
              "
            >
              REGISTER
            </Link>
          </div>
        </div>
      </section>


      <section className="relative mb-6 mt-6 flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      <h2
          className="
            relative flex items-center gap-6
            text-4xl md:text-5xl
            [font-family:var(--font-uncial)]
            tracking-widest
            text-white/90
            px-6
            mb-10
            z-30
          "
        >
          {/* Left line */}
          <span className="relative h-[2px] w-28 md:w-44">
            <span className="absolute inset-0 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
            <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
          </span>
          TRAILER
          {/* Right line */}
          <span className="relative h-[2px] w-28 md:w-44">
            <span className="absolute inset-0 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
            <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
          </span>
        </h2>

        <div className="w-full max-w-5xl px-4 z-30">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/bxmDnn7lrnk"
              title="Arcanex Trailer"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="mt-20 mb-20 w-full flex items-center bg-[#080808]">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div
            className={`
              grid grid-cols-1 md:grid-cols-3
              gap-0 md:gap-10
              items-center
            `}
          >
            <div className="md:col-span-1">
              <Image
                src="/images/arcanex logo (white outline).png"
                alt="Event visual"
                width={600}
                height={800}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            <div className="md:col-span-2 mb-8 md:mb-0">
              <h2 className="text-4xl mb-4">
                About Arcanex
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                This escape room POLOG Project “ARCANEX” is designed as a fun, collaborative game where participants work together, solve challenges, and connect through shared experiences that could bring the community closer in an interactive and engaging way.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="relative mt-6 md:mt-10 flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      <h2
          className="
            relative flex flex-wrap items-center justify-center gap-4
            text-center
            text-3xl sm:text-4xl md:text-5xl
            [font-family:var(--font-uncial)]
            tracking-widest
            text-white/90
            px-4 sm:px-6
            mb-0 md:mb-8
            z-30
          "
        >

        <span className="relative h-[2px] w-28 md:w-44">
          <span className="absolute inset-0 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
          <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-l from-[#961818] via-[#ff4d4d] to-transparent" />
        </span>
        Past Events
        <span className="relative h-[2px] w-28 md:w-44">
          <span className="absolute inset-0 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
          <span className="absolute inset-0 blur-md opacity-80 bg-gradient-to-r from-[#961818] via-[#ff4d4d] to-transparent" />
        </span>
      </h2>
      </section>
  
      <SneakPeekGallery
        coverSrc="/images/escaperoom-image.webp"
        coverLogoSrc="/images/logo-noctura-escaperoom.webp"
        coverTitle="NOCTURA"
        coverDescription="Take a look at highlights from our previous events."
        coverCta="Click to see more"
        coverType="Escape Room"
        photos={[
          "/images/escape_room/1.JPG",
          "/images/escape_room/2.JPG",
          "/images/escape_room/3.JPG",
          "/images/escape_room/4.JPG",
          "/images/escape_room/5.JPG",
          "/images/escape_room/6.JPG",
          "/images/escape_room/7.JPG",
          "/images/escape_room/8.JPG",
          "/images/escape_room/9.JPG",
          "/images/escape_room/10.JPG",
          "/images/escape_room/11.JPG",
        ]}
      />

      <SneakPeekGallery
        coverSrc="/images/casefile-image.webp"
        coverLogoSrc="/images/logo-rectivia-casefile.webp"
        coverTitle="RECTIVIA"
        coverDescription="Take a look at highlights from our previous events."
        coverCta="Click to see more"
        coverType="Case File"
        photos={[
          "/images/casefile/1.JPG",
          "/images/casefile/2.JPG",
          "/images/casefile/3.JPG",
          "/images/casefile/4.JPG",
          "/images/casefile/5.JPG",
          "/images/casefile/6.JPG",
          "/images/casefile/7.JPG",
        ]}
      />
    </SiteShell>
  );
}