import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="w-full h-16 flex items-center justify-around px-4 bg-[#0305000] text-white"
      style={{
        background: "rgba(29, 58, 97, 0.8)",
        borderBottom: "1px solid rgb(41, 86, 122)",
      }}
    >
      <Link href="/">Hylo</Link>

      <div className="flex space-x-8">
        <Link href="/pages/favourite" className="hover:text-gray-400 font-bold">
          Favourite
        </Link>
        <Link href="/pages/visited" className="hover:text-gray-400 font-bold">
          Visited
        </Link>
      </div>
    </nav>
  );
}
