
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { id: 1, text: "Ana sayfa", path: "/" },
  { id: 2, text: "Doktorlar", path: "/doctors" },
  { id: 3, text: "Hizmetler", path: "/services" },
  { id: 4, text: "Hakkımızda", path: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            H
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Medi<span className="text-blue-600">Care</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path);

            return (
              <Link
                key={link.id}
                href={link.path}
                className={`text-sm font-medium transition hover:text-blue-700 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.text}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:inline-flex"
          >
            Giriş yapmak
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Kayıt
          </Link>
        </div>
      </div>
    </header>
  );
}
