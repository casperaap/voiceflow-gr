// app/components/Hero.jsx
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/** Mobile-only infinite loop: move text left; when the first item is fully out, append it to the end */
function BadgeTicker({ text, speed = 0.3, gap = 32, className = "" }) {
  const wrapRef = useRef(null);

useEffect(() => {
  const wrap = wrapRef.current;
  if (!wrap) return;

  const track = wrap.querySelector("[data-track]");
  if (!track) return;

  // Ensure at least one item exists
  let firstItem = track.firstElementChild;
  if (!firstItem) {
    const span = document.createElement("span");
    span.className = "text-sm font-medium";
    span.textContent = text;
    track.appendChild(span);
    firstItem = span;
  }

  // Apply gap to each item
  const applyGap = () =>
    Array.from(track.children).forEach(
      (el) => (el.style.marginRight = `${gap}px`)
    );
  applyGap();

  const mql = window.matchMedia("(max-width: 767.98px)");
  let raf = 0;
  let running = false;

  // Duplicate until we can scroll seamlessly (just enough to cover 2x width)
  const fill = () => {
    const proto = track.firstElementChild;
    if (!proto) return;

    while (track.scrollWidth < wrap.clientWidth * 2) {
      const clone = proto.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
    applyGap();
  };

  let x = 0;
  const step = () => {
    x -= speed;

    const first = track.firstElementChild;
    if (first) {
      const w = first.offsetWidth; // includes margin-right
      if (-x >= w) {
        track.appendChild(first);
        x += w; // keep visual continuity
      }
    }

    track.style.transform = `translate3d(${x}px,0,0)`;
    raf = requestAnimationFrame(step);
  };

  const start = () => {
    if (running) return;       // 🔑 don't restart if already running
    running = true;
    x = 0;
    track.style.transform = `translate3d(${x}px,0,0)`;
    fill();
    raf = requestAnimationFrame(step);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    track.style.transform = ""; // leave text readable when not animating
  };

  // 🔑 NEW: don't stop+start on every resize, just adjust clones
  const onResize = () => {
    if (!mql.matches) {
      stop();
      return;
    }

    if (!running) {
      start();
    } else {
      // keep the current x, just ensure enough clones for the new width
      fill();
    }
  };

  const onChange = (e) => {
    if (e.matches) start();
    else stop();
  };

  // Initial run based on viewport
  if (mql.matches) start();

  window.addEventListener("resize", onResize);
  mql.addEventListener("change", onChange);
  return () => {
    stop();
    window.removeEventListener("resize", onResize);
    mql.removeEventListener("change", onChange);
  };
}, [text, speed, gap]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden flex-1 md:hidden ${className}`}>
      <div data-track className="flex items-center whitespace-nowrap will-change-transform">
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
}

/**
 * Props:
 *   copy: {
 *     titleLine: string,
 *     highlight?: string,
 *     description?: string,
 *     buttonText?: string,
 *     ctaHref?: string
 *   }
 */
export default function Hero({
  copy = {
    titleLine: "Control PowerPoint Presentations Using",
    highlight: "Your Voice",
    description:
      "Navigate slides and present seamlessly with hands-free voice commands — all in your browser.",
    buttonText: "Start Free Trial",
    ctaHref: "/dashboard",
  },
}) {
  const { titleLine, highlight = "", description, buttonText, ctaHref = "/dashboard" } =
    copy;

  // Split title to apply gradient highlight
  let before = titleLine;
  let after = "";
  if (highlight && titleLine.includes(highlight)) {
    const parts = titleLine.split(highlight);
    before = parts[0];
    after = parts.slice(1).join(highlight);
  }

  return (
    <>
      <div className="relative isolate min-h-[75vh] md:min-h-[80vh] flex items-start justify-center px-4 pt-16 md:pt-24">
        {/* Subtle background gradient with square grid pattern */}
        <div className="absolute inset-x-0 top-[-30] h-[700px] pointer-events-none opacity-25">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ebeffc 1px, transparent 1px),
                linear-gradient(to bottom, #ebeffc 1px, transparent 1px)
              `,
              backgroundSize: "220px 220px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(to right, transparent 0px, transparent 1px, rgba(83, 193, 188, 0.18) 1px, rgba(83, 193, 188, 0.10) 219px, transparent 219px, transparent 220px),
                repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(83, 193, 188, 0.18) 1px, rgba(83, 193, 188, 0.10) 219px, transparent 219px, transparent 220px)
              `,
              backgroundSize: "220px 220px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(to right, transparent 0px, transparent 1px, rgba(43, 116, 112, 0.14) 1px, rgba(43, 116, 112, 0.08) 219px, transparent 219px, transparent 220px),
                repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(43, 116, 112, 0.14) 1px, rgba(43, 116, 112, 0.08) 219px, transparent 219px, transparent 220px)
              `,
              backgroundSize: "440px 440px",
              backgroundPosition: "110px 110px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(to right, transparent 0px, transparent 1px, rgba(63, 162, 158, 0.16) 1px, rgba(63, 162, 158, 0.09) 219px, transparent 219px, transparent 220px),
                repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(63, 162, 158, 0.16) 1px, rgba(63, 162, 158, 0.09) 219px, transparent 219px, transparent 220px)
              `,
              backgroundSize: "220px 220px",
              backgroundPosition: "110px 0",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#ebeffc] to-transparent" />
          <div
            className="absolute inset-x-0 top-0 h-40 opacity-70"
            style={{
              background: "linear-gradient(to bottom, #ebeffc 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 25%, transparent 35%, black 45%, transparent 55%, black 70%, black 85%, transparent 95%, transparent 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#ebeffc] to-transparent" />
          <div
            className="absolute inset-x-0 bottom-0 h-48 opacity-70"
            style={{
              background: "linear-gradient(to top, #ebeffc 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 0%, transparent 15%, black 30%, black 40%, transparent 50%, black 60%, transparent 70%, black 80%, black 90%, transparent 100%)",
            }}
          />
        </div>

        <section className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center">
          {/* Pill above title */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white shadow-md max-w-[220px] md:max-w-none overflow-hidden relative">
            <span className="px-2 py-0.5 text-[11px] tracking-wide font-semibold rounded-full bg-white/15 shrink-0 relative z-10">
              New
            </span>

            {/* Phone: smooth, infinite loop (JS-driven) */}
            <BadgeTicker
              text="'Hey Powerpoint, turn on a timer of 5 minutes.'"
              speed={0.2}
              gap={32}
              className="flex-1"
            />

            {/* Desktop: static (no animation) */}
            <div className="hidden md:block">
              <span className="text-base font-medium">
                "Hey Powerpoint, turn on a timer of 5 minutes."
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight max-w-5xl">
            {before}
            {highlight ? (
              <span className="bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] bg-clip-text text-transparent">
                {highlight}
              </span>
            ) : null}
            {after}
          </h1>

          {description ? (
            <p className="text-parag text-base sm:text-xl max-w-2xl mt-4 mx-auto">
              {description}
            </p>
          ) : null}

          <a
            href={ctaHref}
            className="relative inline-flex items-center gap-3 px-7 py-3.5 mt-7 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white text-base md:text-lg font-medium shadow-lg transition hover:scale-105 active:scale-[.98]"
          >
            {buttonText ?? "Get Started"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="currentColor"
            >
              <path d="M13.172 12l-4.95-4.95a1 1 0 111.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 12z" />
            </svg>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
          </a>

          {/* Video placeholder */}
          <div className="w-full mt-10 md:mt-12 aspect-video rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-lg flex items-center justify-center max-w-4xl">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-sm font-medium">Video placeholder</p>
            </div>
          </div>
        </section>
      </div>

      {/* Section title above logos */}
      <div className="max-w-5xl mx-auto px-4 mb-6 mt-10 text-center">
        <h2 className="text-xl md:text-2xl font-medium text-gray-600 animate-fade-in">
          Trusted by 500+ Presenters, Educators, and Business Professionals
        </h2>
      </div>

      {/* brand marquee below the hero */}
      <LogosMarquee />
    </>
  );
}

/* brand marquee (static assets; keep here so Hero is self-contained) */
function LogosMarquee() {
  const logos = [
    "/images/brand1.png",
    "/images/brand2.png",
    "/images/brand3.png",
    "/images/brand4.png",
    "/images/brand5.png",
    "/images/brand6.png",
    "/images/brand7.png",
    "/images/brand8.png",
    "/images/brand9.png",
    "/images/brand10.png",
    "/images/brand11.png",
    "/images/brand12.png",
    "/images/brand13.png",
    "/images/brand14.png",
  ];
  const imgs = [...logos, ...logos];
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="relative overflow-hidden h-14 mb-8 md:mb-12">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#ebeffc] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#ebeffc] to-transparent z-10 pointer-events-none" />
        <div className="flex items-center gap-12 opacity-60 animate-marquee">
          {imgs.map((src, i) => (
            <div key={`${src}-${i}`} className="relative shrink-0 h-14 w-32">
              <Image
                src={src}
                alt={`logo-${i}`}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 144px, 128px"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
