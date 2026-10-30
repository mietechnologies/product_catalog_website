"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import SlideMenu from "./SlideMenu";

export default function Header() {
  const router = useRouter();
  const { auth, ready, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

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
                <button
                  onClick={() => setMenuOpen(true)}
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
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                  Menu
                </button>
              </li>

              {ready && !auth && (
                <li>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                </li>
              )}

              {ready && auth && (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="px-3 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                    >
                      {auth.user.name}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
