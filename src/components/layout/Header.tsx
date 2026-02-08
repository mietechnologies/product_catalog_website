"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral/15 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="MIETech home"
        >
          <Image
            src="/logo.png"
            alt="MIETech logo"
            width={36}
            height={36}
            className="transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-primary tracking-tight">
              MIETech
            </span>
            <span className="text-[10px] text-neutral tracking-widest uppercase">
              Making It Easier
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
                  />
                </svg>
                Catalog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
