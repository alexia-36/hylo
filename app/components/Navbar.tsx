import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav
      className="w-full h-16 flex items-center justify-around px-4 text-white  bg-gradient-to-br from-cyan-500/20 to-blue-900/30 backdrop-blur-xl shadow-xl shadow-black/30"
      style={{
        borderBottom: "1px solid rgb(41, 86, 122)",
      }}
    >
      <Link href="/">logo</Link>

      <div className="flex space-x-8">
        <Link
          href="/pages/favourite"
          className="relative font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[rgb(45,213,255)]  after:transition-all after:duration-300 hover:after:w-full"
        >
          Favourite
        </Link>
        <Link
          href="/pages/visited"
          className="relative font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[rgb(45,213,255)]   after:transition-all after:duration-300  hover:after:w-full"
        >
          Visited
        </Link>
      </div>
    </nav>
  );
}
