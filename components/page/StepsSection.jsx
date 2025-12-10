// app/components/StepsSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollFadeIn from "../ScrollFadeIn";

export default function StepsSection() {
  // Set your target date here (YYYY, MM-1, DD, HH, MM, SS)
  const targetDate = new Date(2025, 11, 31, 23, 59, 59); // December 31, 2025, 23:59:59

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top header (was Anothergradientsec) */}
      <section
        id="pricing"
        className="relative isolate overflow-hidden bg-[#ebeffc] py-8 md:pt-24 scroll-mt-20"
      >
        <ScrollFadeIn>
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#53C1BC]/90 text-black">
              <span className="px-3 py-1 text-[11px] tracking-wide font-semibold rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white">
                Pricing
              </span>
              <span className="text-xs md:text-sm font-medium pr-1">
                Simple pricing for all your needs
              </span>
            </div>
          </div>
        </ScrollFadeIn>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-90 h-[720px]
           bg-[radial-gradient(140%_120%_at_50%_-20%,rgba(83,193,188,1)_0%,rgba(63,162,158,0.7)_35%,rgba(43,116,112,0.35)_60%,transparent_85%)]
           opacity-100 blur-3xl"
        />

        <ScrollFadeIn>
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-black">
              Stop searching for buttons, connect with your audience, use your
              voice!
            </h2>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-black">
              Holiday promo:{" "}
              <span className="font-bold bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] bg-clip-text text-transparent">
                75% off
              </span>{" "}
              VoiceFlow for the next{" "}
              <span className="font-semibold">
                {timeLeft.days}d :{" "}
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </p>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Pricing Cards */}
      <section className="bg-[#ebeffc] py-8 md:py-16 mb-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Pro Plan */}
            <ScrollFadeIn>
              <div className="relative bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                {/* Most Popular Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white text-xs font-semibold uppercase tracking-wide shadow-md">
                    Limited Offer ✨
                  </span>
                </div>

                {/* Plan Name */}
                <div className="mt-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-6">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                    <span>Pro</span>
                  </div>

                  <div className="mb-2">
                    <span className="text-2xl font-medium text-gray-400 line-through mr-2">
                      $75
                    </span>
                    <span className="text-5xl font-bold text-gray-900">
                      $19
                    </span>
                    <span className="text-gray-500 text-lg"> /month</span>
                  </div>
                  <p className="text-sm text-gray-600">For individuals.</p>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 px-5 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-8">
                  Start your free trial
                  <svg
                    className="inline-block ml-2 w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.172 12l-4.95-4.95a1 1 0 111.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 12z" />
                  </svg>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-10"></div>

                {/* Features List */}
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Create unlimited projects
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Basic trigger words
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Your Queue and advanced settings
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      All special commands
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Supported language: English
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Unlimited .pptx file size
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Request new commands
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Quick presentation dummy
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollFadeIn>

            {/* Enterprise Plan */}
            <ScrollFadeIn>
              <div className="relative bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                {/* Plan Name */}
                <div className="mt-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-6">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                    <span>Enterprise</span>
                  </div>

                  <div className="mb-2">
                    <span className="text-5xl font-bold text-gray-900">
                      +$99
                    </span>
                    <span className="text-gray-500 text-lg"> /month</span>
                  </div>
                  <p className="text-sm text-gray-600">For organizations.</p>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 px-5 rounded-full bg-black text-white font-semibold hover:bg-black/90 transition-colors mb-8">
                  Contact
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-10"></div>

                {/* Features List */}
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Create unlimited projects
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Basic trigger words
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Your Queue and advanced settings
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      All special commands
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Supported language: English
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Unlimited .pptx file size
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Price reduction per account
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-gray-700 text-sm">Team accounts</span>
                  </li>
                </ul>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
