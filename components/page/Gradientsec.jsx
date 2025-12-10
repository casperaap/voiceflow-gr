// app/components/Gradientsec.jsx
import Image from "next/image";
import ScrollFadeIn from "../ScrollFadeIn";

export default function Gradientsec() {
  return (
    <section id="features" className="relative overflow-hidden scroll-mt-20">
      {/* Purple gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-90 h-[720px]
           bg-[radial-gradient(140%_120%_at_50%_-20%,rgba(83,193,188,1)_0%,rgba(63,162,158,0.7)_35%,rgba(43,116,112,0.35)_60%,transparent_85%)]
           opacity-100 blur-3xl"
      />

      {/* Content */}
      <ScrollFadeIn>
        <div className="relative z-10 py-12 md:py-20 text-center">
          {/* Brand badge */}
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#53C1BC]/90 text-black">
              <span className="px-3 py-1 text-[11px] tracking-wide font-semibold rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white">
                Features
              </span>
              <span className="text-xs md:text-sm font-medium pr-1">
                What we do
              </span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-tight max-w-2xl m-auto">
            Say goodbye fragile and costly remote controllers
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-gray-700 text-sm md:text-base">
            Navigating your powerpoint should be as easy as talking. VoiceFlow
            keeps everything streamlined and easy to manage from its
            simple-to-use interface. It’s designed for a human-first
            storytelling experience. No more needing to search for buttons.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Feature cards moved from dark section */}
      <div className="mx-auto max-w-7xl mt-2 md:mt-4 px-6 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* Card 1 */}
          <div className="md:col-span-6">
            <ScrollFadeIn>
              <div className="relative rounded-[28px] border border-gray-200 bg-[#dfe1e3] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="rounded-[26px] bg-white overflow-hidden">
                  <div className="p-6 md:p-8 pb-0 md:-mb-4 mb-4">
                    <span className="text-sm md:text-base font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]">
                      Next & Back
                    </span>
                    <h3 className="mt-2 text-xl md:text-3xl font-semibold text-gray-900">
                      Use basic trigger words to navigate PowerPoint
                    </h3>
                    <p className="mt-5 text-sm md:text-base text-gray-600">
                      Use basic trigger words like "Next" and "Back" to navigate
                      through your PowerPoint flawlessly. Change these trigger
                      words to anything you want to suit your style.
                    </p>
                  </div>

                  <Image
                    src="/images/nextback1.png"
                    alt="Next and Back"
                    width={700}
                    height={394}
                    sizes="(max-width: 768px) 598px, (max-width: 1024px) 560px, 560px"
                    quality={80}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </ScrollFadeIn>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-6">
            <ScrollFadeIn>
              <div className="relative rounded-[28px] border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="rounded-[26px] bg-white overflow-hidden">
                  <div className="p-6 md:p-8 pb-0 md:-mb-4 mb-4">
                    <span className="text-sm md:text-base font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]">
                      Your Queue
                    </span>
                    <h3 className="mt-2 text-xl md:text-3xl font-semibold text-gray-900">
                      Hide a queue of trigger words inside your script
                    </h3>
                    <p className="mt-5 text-sm md:text-base text-gray-600">
                      Choose words from your script and use them to navigate
                      your slides. This allows you to hide trigger words. A
                      simple queue of words will navigate your PowerPoint from
                      the first to the last slide.
                    </p>
                  </div>

                  <Image
                    src="/images/yourqueue1.png"
                    alt="Your Queue"
                    width={700}
                    height={450}
                    sizes="(max-width: 768px) 598px, (max-width: 1024px) 560px, 560px"
                    quality={80}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </ScrollFadeIn>
          </div>

          {/* Card 3 (wide) */}
          <div className="md:col-span-12">
            <ScrollFadeIn>
              <div className="relative rounded-[28px] border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full">
                <div className="rounded-[26px] bg-white overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Text column */}
                    <div className="p-6 md:p-8 flex flex-col justify-between h-full">
                      <span className="text-sm md:text-base font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]">
                        Custom Commands
                      </span>
                      <h3 className="mt-2 text-xl md:text-3xl font-semibold text-gray-900">
                        Say "Hey Powerpoint" to ask specific actions
                      </h3>
                      <p className="mt-5 -mb-2 md:mb-4 text-sm md:text-base text-gray-600 max-w-xl">
                        By saying "Hey PowerPoint" you can now ask your
                        powerpoint for specific actions like "give me a
                        blackscreen", or "turn on a timer of 5 minutes" and
                        more. Edit your command prefix from "Hey PowerPoint" to
                        anything you want in the settings. We are determined to
                        add extra commands every week based on user feedback.
                      </p>
                    </div>

                    {/* Image column */}
                    <div className="p-0">
                      <Image
                        src="/images/commands.png"
                        alt="Hey PowerPoint commands"
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={80}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </div>

      {/* Case study slice */}
      <ScrollFadeIn>
        <section className="relative bg-[#ebeffc] py-0 md:py-12">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="relative grid gap-8 md:grid-cols-2 md:gap-16 items-start">
              <span
                className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-gray-200"
                aria-hidden="true"
              />

              {/* Left – Key results */}
              <div>
                <p className="text-sm font-medium tracking-wide text-gray-500 text-center">
                  Case Study: Voiceflow vs Logitech Spotlight
                </p>

                <div className="mt-6 md:mt-10 grid grid-cols-2 gap-10">
                  <div className="text-center">
                    <div className="text-4xl md:text-7xl font-bold">-90%</div>
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                      Purchase Cost
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl md:text-7xl font-bold">1 Min</div>
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                      Delivery Time
                    </p>
                  </div>
                </div>
              </div>

              {/* Right – Logo + quote */}
              <div className="md:pl-12">
                <div className="text-2xl font-semibold tracking-wide text-gray-600">
                  Testemonial.
                </div>

                <blockquote className="mt-6 text-left leading-relaxed text-gray-700 text-sm md:text-base">
                  We did tests with other companies, and VoiceFlow's voice
                  recognition seems to be on top of its competition. It is crazy
                  to think about how the future of storytelling will change.
                  Remote controllers have their advantages but VoiceFlow has
                  been much more sustainable and affordable.
                </blockquote>

                <p className="mt-6 text-sm md:text-base font-medium text-gray-900">
                  Luc Apers, Public speaker & magician
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollFadeIn>
    </section>
  );
}
