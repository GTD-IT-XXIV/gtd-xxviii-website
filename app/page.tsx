"use client";
import Link from "next/link";
import Image from "next/image";
import { SneakPeekGallery } from "@/components/SneakPeekGallery";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cinematic, setCinematic] = useState(false);
  const [exiting, setExiting] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    };
  }, []);

  const startCinematic = async () => {
    if (cinematic || exiting) return;

    setExiting(true);

    window.setTimeout(async () => {
      setCinematic(true);

      requestAnimationFrame(async () => {
        try {
          if (videoRef.current) {
            videoRef.current.volume = 0.5;
            await videoRef.current.play();
          }
        } catch {
        }
      });
    }, 900);
  };

  const endCinematicWithHold = () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);

    holdTimerRef.current = window.setTimeout(() => {
      setCinematic(false);


      window.setTimeout(() => {
        setExiting(false);

        // Reset video after UI starts returning (prevents flash)
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, 650);
    }, 2000);
  };

  const skipCinematic = () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setCinematic(false);

    window.setTimeout(() => {
      setExiting(false);
    }, 650);
  };

  return (
    <main>
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
        <div
          className={`
            absolute inset-0 z-20
            transition-opacity ease-out
            ${cinematic ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          style={{ transitionDuration: cinematic ? "900ms" : "1400ms" }} // ✅ slower fade out when leaving
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={"/videos/Fight%20Scene.mp4"}
            playsInline
            onEnded={endCinematicWithHold}
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
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-center">
          <div
            className="
              absolute
              -top-46 sm:-top-46 md:-top-56
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            
            <div className="md:col-span-1">
              <Image
                src="/images/arcanex logo (white outline).png"
                alt="Event visual"
                width={600}
                height={800}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            <div className="md:col-span-2">
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
      <section className="relative mt-6 flex flex-col items-center justify-center bg-[#080808] overflow-hidden">
      <h2
          className="
            relative flex flex-wrap items-center justify-center gap-4
            text-center
            text-3xl sm:text-4xl md:text-5xl
            [font-family:var(--font-uncial)]
            tracking-widest
            text-white/90
            px-4 sm:px-6
            mb-10
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
          "/images/escape_room/1.jpg",
          "/images/escape_room/2.jpg",
          "/images/escape_room/3.jpg",
          "/images/escape_room/4.jpg",
          "/images/escape_room/5.jpg",
          "/images/escape_room/6.jpg",
          "/images/escape_room/7.jpg",
          "/images/escape_room/8.jpg",
          "/images/escape_room/9.jpg",
          "/images/escape_room/10.jpg",
          "/images/escape_room/11.jpg",
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
          "/images/casefile/1.jpg",
          "/images/casefile/2.jpg",
          "/images/casefile/3.jpg",
          "/images/casefile/4.jpg",
          "/images/casefile/5.jpg",
          "/images/casefile/6.jpg",
          "/images/casefile/7.jpg",
        ]}
      />
    </main>
  );
}