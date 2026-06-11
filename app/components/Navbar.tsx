import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-900/40 bg-gradient-to-br from-cyan-500/20 to-blue-900/30 backdrop-blur-xl shadow-xl shadow-black/20">
      <div className=" mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 via-teal-300 via-amber-300 to-orange-500 bg-clip-text text-transparent"
        >
          hylo
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/pages/visited"
            className="relative text-sm sm:text-base font-semibold text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-cyan-300 after:via-teal-300 after:to-orange-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Visited
          </Link>

          <Link
            href="/pages/favourite"
            className="relative text-sm sm:text-base font-semibold text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-cyan-300 after:via-teal-300 after:to-orange-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Favourite
          </Link>

          <Link
            href="/pages/profile"
            className="relative text-sm sm:text-base font-semibold text-white after:content-[''] "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
