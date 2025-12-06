// app/components/page/Header.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`md:relative fixed top-0 left-0 right-0 z-50 text-white transition-colors duration-300 ${
        open ? "bg-[#ebeffc]" : "bg-[#ebeffc]/70 backdrop-blur-md"
      } md:bg-transparent md:backdrop-blur-0`}
    >
      {/* Top bar */}
      <div className="grid grid-cols-3 items-center py-3 md:py-4 px-4 lg:px-8">
        {/* Logo (left padding added) */}
        <Link href="/" className="inline-flex items-center gap-3 pl-2">
          <Image
            src="/images/vf-icon-green (2).png"
            alt="VoiceFlow logo"
            width={50}
            height={40}
            priority
          />
          <span className="text-xl md:text-[1.4rem] font-bold text-black">VoiceFlow</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-black/80 hover:text-black transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-black/80 hover:text-black transition-colors cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("faq")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-black/80 hover:text-black transition-colors cursor-pointer"
          >
            FAQs
          </a>
        </nav>

        {/* Desktop right-side actions (right padding added) */}
        <div className="hidden sm:flex items-center gap-3 justify-self-end pr-2">
          <a
            href="/dashboard"
            className="px-5 py-3 rounded-3xl bg-black text-white hover:bg-black/90 transition-colors text-sm font-medium"
          >
            Start for FREE
          </a>
          <a
            href="/dashboard"
            className="px-5 py-3 rounded-3xl bg-gradient-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white hover:opacity-90 transition-colors text-sm font-semibold shadow"
          >
            Log in / Sign Up
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <div className="sm:hidden flex justify-end col-start-3 justify-self-end pr-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                open ? "rotate-90" : ""
              }`}
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth={2}
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden absolute left-0 right-0 top-full overflow-hidden bg-[#ebeffc] transition-[max-height] duration-300 px-4 shadow-lg z-50 rounded-b-2xl ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-2 py-2 pb-6">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
              setOpen(false);
            }}
            className="text-black px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
              setOpen(false);
            }}
            className="text-black px-4 py-2 rounded-md hover:bg:white/10 cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("faq")
                ?.scrollIntoView({ behavior: "smooth" });
              setOpen(false);
            }}
            className="text-black px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer"
          >
            FAQ
          </a>
          <a
            href="/dashboard"
            className="block text-center gap-3 px-4 py-3 mt-2 rounded-full text-white shadow-lg transition hover:scale-105 active:scale-[.98] bg-gradient-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]"
          >
            Log in / Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
