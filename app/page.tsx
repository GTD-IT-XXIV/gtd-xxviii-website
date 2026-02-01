import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <section className="group relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image layer */}
        <div
          className="
            absolute inset-0
            bg-[url('/Images/main_background.png')]
            bg-cover bg-center bg-no-repeat
            opacity-45
            transition-opacity duration-300

            group-has-[h1:hover]:opacity-15
            group-has-[a:hover]:opacity-15

            [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
            [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
          "
        />

        {/* Optional dark tint */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1
            className="
              text-7xl md:text-8xl
              [font-family:var(--font-uncial)]
              text-white
              transition-all duration-400 ease-out
              hover:scale-135
              hover:text-[#ff4d4d]
              hover:drop-shadow-[0_0_25px_rgba(255,77,77,0.7)]
              cursor-default
            "
          >
            ARCANEX
          </h1>

          <p className="mt-6 text-[22px] text-gray-300">28 February – 1 March</p>

          <Link
            href="/register"
            className="
              mt-10 inline-block
              px-10 py-4
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
      </section>



      <section className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <h2 className="text-4xl md:text-5xl mb-10 text-white tracking-widest">
          TRAILER
        </h2>

        <div className="w-full max-w-6xl px-4">
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

      <section className="min-h-screen w-full flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            
            {/* Left image (≈33%) */}
            <div className="md:col-span-1">
              <Image
                src="/images/logo.png"
                alt="Event visual"
                width={600}
                height={800}
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            {/* Right text (≈67%) */}
            <div className="md:col-span-2">
              <h2 className="text-4xl mb-4">
                About Arcanex
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}