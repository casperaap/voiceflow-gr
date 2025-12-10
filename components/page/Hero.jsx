// app/components/Hero.jsx
"use client";

import React from "react";
import Image from "next/image";
import ScrollFadeIn from "../ScrollFadeIn";

/** Mobile-only marquee loop; two identical groups slide left for a seamless repeat */
function BadgeTicker({ text, duration = 18, gap = 28, className = "" }) {
  return (
    <div className={`relative overflow-hidden flex-1 md:hidden ${className}`}>
      <div
        className="badge-marquee"
        style={{ "--badge-duration": `${duration}s`, "--badge-gap": `${gap}px` }}
      >
        <div className="badge-marquee__track">
          <div className="badge-marquee__group">
            <span className="badge-marquee__item">{text}</span>
          </div>
          <div className="badge-marquee__group" aria-hidden="true">
            <span className="badge-marquee__item">{text}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .badge-marquee {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .badge-marquee__track {
          display: flex;
          width: max-content;
          animation: badge-loop var(--badge-duration) linear infinite;
          will-change: transform;
        }
        .badge-marquee__group {
          display: inline-flex;
          align-items: center;
          gap: var(--badge-gap);
          padding-right: var(--badge-gap);
          white-space: nowrap;
        }
        .badge-marquee__item {
          font-size: 0.95rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        @keyframes badge-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
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
    <ScrollFadeIn>
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

            {/* Phone: smooth, infinite loop (CSS-driven, matches logo marquee) */}
            <BadgeTicker
              text="'Hey Powerpoint, turn on a timer of 5 minutes.'"
              duration={18}
              gap={28}
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
    </ScrollFadeIn>
  );
}

/* brand marquee (static assets; keep here so Hero is self-contained) */
function LogosMarquee({ desktopDuration = 22.5, mobileDuration = 40 }) {
  const logos = [
    "/images/logos/1.png",
    "/images/logos/2.png",
    "/images/logos/3.png",
    "/images/logos/4.png",
    "/images/logos/5.png",
    "/images/logos/6.png",
  ];
  const imgs = [...logos, ...logos];
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="relative overflow-hidden h-14 mb-8 md:mb-12">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#ebeffc] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#ebeffc] to-transparent z-10 pointer-events-none" />
        <div
          className="flex items-center gap-12 opacity-60 animate-marquee"
          style={{
            "--marquee-duration-desktop": `${desktopDuration}s`,
            "--marquee-duration-mobile": `${mobileDuration}s`,
          }}
        >
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
