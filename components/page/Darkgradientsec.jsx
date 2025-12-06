// app/components/Darkgradientsec.jsx
import Image from "next/image";
import YouTubeLite from "./YouTubeLite";

export default function Darkgradientsec({
  copy = {
    heading: "Take full control of your slides",
    highlight: "full control",
    text: "Modify trigger words for a more intuitive, personal, and captivating presentation.",
  },
}) {
  const { heading, highlight = "", text } = copy;

  // safe split for highlighted word
  let before = heading;
  let after = "";
  if (highlight && heading.includes(highlight)) {
    const parts = heading.split(highlight);
    before = parts[0];
    after = parts.slice(1).join(highlight);
  }

  const sectors = [
    {
      name: "Retailers",
      color: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100", cta: "text-emerald-500 hover:text-emerald-400" },
      icon: (
       // Outline / stroke version
<svg
  className="h-5 w-5"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.6"
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
>
  {/* handle + push */}
  <path d="M3 4h2l2.2 10.6a1.6 1.6 0 0 0 1.56 1.3H17.5a1.6 1.6 0 0 0 1.55-1.2L21 7H6.2" />
  {/* basket lip (subtle detail) */}
  <path d="M7.5 11.5h10" />
  {/* wheels */}
  <circle cx="9" cy="19.5" r="1.5" />
  <circle cx="17" cy="19.5" r="1.5" />
</svg>
      ),
      options: [
        "Run product and campaign decks hands-free in store meetings and vendor reviews. Use simple voice commands to move through slides while demoing products or handling samples."
      ],
    },
    {
      name: "Artists",
      color: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100", cta: "text-indigo-500 hover:text-indigo-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7a5 5 0 119.584 1.688A4 4 0 1116 19H7a4 4 0 01-1-7.874A5 5 0 017 7z"/></svg>
      ),
      options: [
        "Showcase portfolios and moodboards without being glued to a clicker. Use your voice to flip through slides while sketching, sculpting, or demoing live."
      ],
    },
    {
      name: "Influencers",
      color: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100", cta: "text-sky-500 hover:text-sky-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm0 4h10v12H7V6z"/></svg>
      ),
      options: [
        "Present media kits, analytics, and campaign concepts with both hands free. Navigate slides by voice while recording content or streaming to your audience."
      ],
    },
    {
      name: "Teachers",
      color: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100", cta: "text-rose-500 hover:text-rose-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v4H3V4zm0 6h11v10H3V10zm13 0h5v6h-5v-6z"/></svg>
      ),
      options: [
        "Deliver UGC videos for every client, channel, and audience. Clone winning creator styles and produce UGC-style content inside a streamlined workflow."
      ],
    },
    {
      name: "Therapists",
      color: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100", cta: "text-amber-500 hover:text-amber-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l7 4-7 4-7-4 7-4zm0 9l7 4-7 4-7-4 7-4z"/></svg>
      ),
      options: [
        "Run group sessions, workshops, or webinars without fumbling for a remote. Use your voice to pace psychoeducation slides while staying fully present with clients."
      ],
    },
    {
      name: "Sales People",
      color: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", ring: "ring-fuchsia-100", cta: "text-fuchsia-500 hover:text-fuchsia-400" },
      icon: (
        <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 4.5v15" />
        <g transform="translate(24,0) scale(-1,1)">
          <path d="M8.5 9c0-1.38 1.57-2.5 3.5-2.5s3.5 1.12 3.5 2.5-1.57 2.5-3.5 2.5-3.5 1.12-3.5 2.5 1.57 2.5 3.5 2.5 3.5-1.12 3.5-2.5" />
        </g>
      </svg>
      ),
      options: [
        "Pitch from anywhere without worrying about clickers or cables. Drive demos, pricing slides, and case studies using only your voice."
      ],
    },
    {
      name: "Journalists",
      color: { bg: "bg-cyan-50", text: "text-cyan-600", ring: "ring-cyan-100", cta: "text-cyan-500 hover:text-cyan-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"/></svg>
      ),
      options: [
        "Walk audiences through timelines, data, and quotes in press briefings or talks. Keep both hands free for notes while you control every slide by voice."
      ],
    },
    {
      name: "Comedians",
      color: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-100", cta: "text-teal-500 hover:text-teal-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"/></svg>
      ),
      options: [
        "Trigger punchline images, callbacks, and visual bits on cue without touching a laptop. Advance or rewind slides mid-set with natural voice commands."
      ],
    },
    {
      name: "Consultants",
      color: { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200", cta: "text-slate-400 hover:text-slate-300" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l6 3v3a6 6 0 11-12 0V6l6-3zm-7 14h14v2H5v-2z"/></svg>
      ),
      options: [
        "Lead strategy workshops and complex decks while writing on whiteboards or facilitating exercises. Use voice navigation to jump between slides and keep sessions flowing."
      ],
    },
    {
      name: "Hosts",
      color: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100", cta: "text-rose-500 hover:text-rose-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3c2 0 3 1 5 1s3-1 5-1c2 0 4 2 4 4 0 6-3 9-4 9-2 0-2-3-5-3s-3 3-5 3c-1 0-4-3-4-9 0-2 2-4 4-4z"/></svg>
      ),
      options: [
        "Run event intros, sponsor slides, and house rules smoothly from the stage. Control the whole deck with your voice while keeping your focus on the crowd."
      ],
    },
    {
      name: "Financial Services",
      color: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100", cta: "text-violet-500 hover:text-violet-400" },
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10l9-7 9 7v9H3v-9zm4 2h2v5H7v-5zm4 0h2v5h-2v-5zm4 0h2v5h-2v-5z"/></svg>
      ),
      options: [
        "Guide clients through reports, forecasts, and disclosures hands-free. Use spoken commands to move between sections while keeping eye contact."
      ],
    },
    {
      name: "Students",
      color: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100", cta: "text-violet-500 hover:text-violet-400" },
      icon: (
        // mortarboard
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l10 5-10 5L2 8l10-5zm8 8v5a1 1 0 01-.553.894L12 20l-7.447-3.106A1 1 0 014 16v-5l8 4 8-4z"/></svg>
      ),
      options: [
        "Present group projects, theses, or defenses with confidence. Turn pages, jump to backups, and revisit key arguments just by speaking."
      ],
    },
    {
      name: "Magicians",
      color: { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-100", cta: "text-pink-500 hover:text-pink-400" },
      icon: (
        // sparkles
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm12 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-2 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>
      ),
      options: [
        "Cue up dramatic titles, reveals, and instructions without exposing a clicker. Let voice-controlled slides keep pace with your routine."
      ],
    },
    {
      name: "Public Speakers",
      color: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", ring: "ring-fuchsia-100", cta: "text-fuchsia-500 hover:text-fuchsia-400" },
      icon: (
        // people
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 1114 0H5z"/></svg>
      ),
      options: [
        "Own the stage in keynotes, panels, and workshops. Navigate slides by voice so you can move freely and stay fully engaged with the audience."
      ],
    },
    {
      name: "Event Planners",
      color: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100", cta: "text-amber-500 hover:text-amber-400" },
      icon: (
        // truck
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h10v7h6l2 3v2h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V6zm13 1h2l3 4h-5V7z"/></svg>
      ),
      options: [
        "Show run-of-show decks, venue layouts, and sponsor packages from any spot in the room. Advance slides by voice while you point, demo, and negotiate."
      ],
    },
    {
      name: "Content Creators",
      color: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100", cta: "text-purple-500 hover:text-purple-400" },
      icon: (
        // play
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
      ),
      options: [
        "Pitch concepts, content calendars, and results live on calls or on stage. Control every slide hands-free so you can focus on storytelling and audience reaction."
      ],
    },
  ];

  const toSlug = (name) => `/${name.toLowerCase().replace(/[\s/]+/g, "-")}`;

  const renderCard = (s) => (
    <div className="h-full rounded-2xl bg-[#201E1C] p-6">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color.bg} ${s.color.text} ring-1 ${s.color.ring}`}>
          {s.icon}
        </span>
        <h3 className="text-lg md:text-xl font-semibold text-white">
          {`${s.name}`}
        </h3>
      </div>
  
      {/* 3 suggestions (keep your paragraph styling) */}
      <div className="mt-5 space-y-2 text-sm leading-6 text-white">
        {s.options.map((opt, i) => (
          <p key={i} className="text-white">
            {opt}
          </p>
        ))}
      </div>
  
      {/* functional link using your slug rule */}
      <a
  href={toSlug(s.name)}
  className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${s.color.cta}`}
>
  <span>Learn more</span>
  <span className="sr-only">{` about ${s.name} UGC ad use cases`}</span>
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.172 12l-4.95-4.95a1 1 0 111.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 12z"/>
  </svg>
</a>
    </div>
  );

  return (
    <section className="relative isolate overflow-hidden bg-[#141b2d] mt-12 py-12 md:py-28">
      {/* Top gradient glow */}  
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-90 h-[720px]
                  bg-[radial-gradient(140%_120%_at_50%_-20%,rgba(83,193,188,1)_0%,rgba(63,162,158,0.7)_35%,rgba(43,116,112,0.35)_60%,transparent_85%)]
                  opacity-100 blur-3xl"

      />

      {/* Heading + subcopy */}
      <div className="relative mx-0 md:mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-center text-3xl md:text-5xl font-bold leading-tight text-white">
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#53C1BC]/30 text-white">
              <span className="px-3 py-1 text-[11px] tracking-wide font-semibold rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]">Steps</span>
              <span className="text-xs md:text-sm font-medium pr-1">Discover how VoiceFlow works</span>
            </div>
          </div>
          {before}
          {highlight ? (
            <span className="bg-[radial-gradient(181.25%_467.44%_at_122.05%_169.77%,_#53C1BC_0,_#3FA29E_38%,_#3FA29E_54%,_#2B7470_83%)] bg-clip-text text-transparent">
              {highlight}
            </span>
          ) : null}
          {after}
        </h2>

        <p className="text-center mt-6 mb-10 text-base font-semibold md:text-2xl md:font-normal leading-relaxed text-white/90">
          {text}
        </p>
      </div>

      {/* Steps Section - Replicated from StepsSection.jsx */}
      <section className="bg-transparent py-4 md:py-20 mt-12 md:mt-32 space-y-20 mb-12 md:mb-0 alternating-blocks">
        {[
          { src: "step1.webm", type: "video", title: "Create a project", desc: "You can create and edit projects to organize different powerpoints with different scripts." },
          { src: "step2.webm",  type: "video", title: "Choose your own settings", desc: "Choose your own trigger words to navigate your slides, and control commands." },
          { src: "step3.webm",  type: "video", title: "Start presentation",     desc: "Upload your powerpoint.pptx file, click start presentation and begin your talk." },
        ].map(({ src, type, title, desc }, idx) => (
          <div
            key={title}
            className={`flex flex-col items-start md:items-center pb-0 md:pb-8 gap-10 md:gap-16 md:flex-row ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {type === "video" ? (
              <video
                src={`/images/${src}`}
                className="rounded-xl shadow-xl px-2 md:px-0"
                width={600}
                height={320}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={`/images/${src}`}
                alt={title}
                className="rounded-xl shadow-xl px-2 md:px-0"
                width={600}
                height={320}
              />
            )}
            <div className="flex flex-col gap-4 max-w-md text-left md:text-left mx-6 md:mx-0">
              <h3 className="text-base md:text-xl md:mb-3 font-semibold text-gray-400">
                {`Step ${idx + 1}`}
              </h3>
              <h3 className="text-xl md:text-3xl md:mb-4 font-semibold text-white">
                {title}
              </h3>
              <p className="text-white/80 text-sm md:text-base">{desc}</p>

              <a
                href="/dashboard"
                className="relative self-start inline-flex items-center gap-3 px-4 py-3 mt-2 md:mt-4 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white shadow-lg transition hover:scale-105 active:scale-[.98]"
              >
                Start Free Trial
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M13.172 12l-4.95-4.95a1 1 0 111.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 12z" />
                </svg>
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Use Cases heading + CTA */}
      <div className="mx-auto max-w-7xl mt-24 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] items-center mt-2 md:mt-8 px-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                <div className="mb-4 flex items-center">
                  <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#53C1BC]/30 text-white">
                    <span className="px-3 py-1 text-[11px] tracking-wide font-semibold rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470]">Use Cases</span>
                    <span className="text-xs md:text-sm font-medium pr-1">For who is VoiceFlow</span>
                  </div>
                </div>
                <span className="bg-[radial-gradient(181.25%_467.44%_at_122.05%_169.77%,#53C1BC_0,#3FA29E_38%,#3FA29E_54%,#2B7470_83%)] bg-clip-text text-transparent">
                 From Speakers to Storytellers. 
                </span>
                <br className="hidden md:block" />
                 100+ Use Cases for VoiceFlow.
              </h2>

          <a
            href="/dashboard"
            className="w-fit md:justify-self-end relative inline-flex items-center gap-3 px-4 py-3 mt-8 md:mt-4 rounded-full bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white shadow-lg transition hover:scale-105 active:scale-[.98]"
          >
            Get access to Voiceflow
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="currentColor"
            >
              <path d="M13.172 12l-4.95-4.95a1 1 0 111.414-1.414l6.364 6.364a1 1 0 010 1.414l-6.364 6.364a1 1 0 01-1.414-1.414L13.172 12z" />
            </svg>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
          </a>
        </div>

        {/* FULL-BLEED MARQUEE (edge-to-edge) */}
        <div className="mt-12 md:mt-16">
          <div className="max-w-[1400px] mx-auto relative overflow-hidden">
            {/* Left fade */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#141b2d] to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#141b2d] to-transparent z-10 pointer-events-none" />
            
            <div className="space-y-6">
  {/* Row 1 — R→L */}
  <div className="group overflow-hidden" style={{
    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
    maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)"
  }}>
    <div
      className="flex min-w-max gap-6 group-hover:[animation-play-state:paused]"
      style={{
        animationName: "marquee-left",
        animationDuration: "105s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        willChange: "transform",
      }}
    >
      <ul className="flex min-w-max gap-6">
        {sectors.slice(0, Math.ceil(sectors.length / 2)).map((s) => (
          <li key={s.name} className="w-[380px] md:w-[420px]">
            {renderCard(s)}
          </li>
        ))}
      </ul>
      <ul className="flex min-w-max gap-6">
        {sectors.slice(0, Math.ceil(sectors.length / 2)).map((s) => (
          <li key={`${s.name}-dup`} className="w-[380px] md:w-[420px]">
            {renderCard(s)}
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Row 2 — L→R */}
  <div className="group overflow-hidden" style={{
    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
    maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)"
  }}>
    <div
      className="flex min-w-max gap-6 group-hover:[animation-play-state:paused]"
      style={{
        animationName: "marquee-right",
        animationDuration: "105s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        willChange: "transform",
      }}
    >
      <ul className="flex min-w-max gap-6">
        {sectors.slice(Math.ceil(sectors.length / 2)).map((s) => (
          <li key={s.name} className="w-[380px] md:w-[420px]">
            {renderCard(s)}
          </li>
        ))}
      </ul>
      <ul className="flex min-w-max gap-6">
        {sectors.slice(Math.ceil(sectors.length / 2)).map((s) => (
          <li key={`${s.name}-dup`} className="w-[380px] md:w-[420px]">
            {renderCard(s)}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
          </div>
        </div>
        {/* /Marquees */}
      </div>
    </section>
  );
}