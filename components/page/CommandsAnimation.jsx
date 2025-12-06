"use client";

export default function CommandsAnimation() {
  return (
    <div className="relative h-[450px] flex items-center justify-center overflow-hidden scale-75">
      {/* Dashed connectors from center → 4 icons */}
      {/* Center → Top */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: 0,
          height: "150px",
          borderLeft: "2px dashed #53C1BC",
          transform: "translate(-50%, -100%)",
          zIndex: 1,
        }}
      />
      {/* Center → Right */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "150px",
          height: 0,
          borderTop: "2px dashed #53C1BC",
          transform: "translate(0, -50%)",
          zIndex: 1,
        }}
      />
      {/* Center → Bottom */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: 0,
          height: "150px",
          borderLeft: "2px dashed #53C1BC",
          transform: "translate(-50%, 0)",
          zIndex: 1,
        }}
      />
      {/* Center → Left */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "150px",
          height: 0,
          borderTop: "2px dashed #53C1BC",
          transform: "translate(-100%, -50%)",
          zIndex: 1,
        }}
      />

      {/* Center VoiceFlow icon with pulsing radio effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 3 }}
      >
        {/* Radio wave rings - very close to icon with filled glow */}
        <div className="absolute inset-0 -m-3">
          {/* Filled glowing waves */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-radial from-[#53C1BC]/30 via-[#53C1BC]/15 to-transparent animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-0 rounded-full bg-gradient-radial from-[#3FA29E]/25 via-[#3FA29E]/10 to-transparent animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute inset-0 rounded-full bg-gradient-radial from-[#2B7470]/20 via-[#2B7470]/8 to-transparent animate-ping"
            style={{ animationDuration: "2s", animationDelay: "1.4s" }}
          />

          {/* Border rings for definition */}
          <div
            className="absolute inset-0 rounded-full border-2 border-[#53C1BC]/50 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-[#3FA29E]/40 animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-[#2B7470]/30 animate-ping"
            style={{ animationDuration: "2s", animationDelay: "1.4s" }}
          />
        </div>

        {/* Core glow */}
        <div className="absolute inset-0 -m-4 rounded-full bg-[#53C1BC]/40 blur-2xl animate-pulse" />
        <div
          className="absolute inset-0 -m-3 rounded-full bg-[#3FA29E]/35 blur-xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* VoiceFlow icon */}
        <div className="relative bg-white rounded-full p-5 shadow-2xl border-4 border-[#53C1BC]/50 shadow-[#53C1BC]/20">
          <img
            src="/images/vf-icon-green (2).png"
            alt="VoiceFlow"
            className="w-12 h-12"
          />
        </div>
      </div>

      {/* PowerPoint - Top */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2"
        style={{ zIndex: 2 }}
      >
        <div className="bg-white rounded-full p-3 shadow-md border border-gray-200 hover:scale-110 hover:shadow-xl transition-all">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="8" fill="#D24726" />
            <path
              d="M28 14h-8v20h8c4.4 0 8-3.6 8-8s-3.6-8-8-8zm0 14h-4v-8h4c2.2 0 4 1.8 4 4s-1.8 4-4 4z"
              fill="white"
            />
            <path d="M14 14v20h4V14h-4z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Google Slides - Right */}
      <div
        className="absolute top-1/2 right-12 -translate-y-1/2"
        style={{ zIndex: 2 }}
      >
        <div className="bg-white rounded-full p-3 shadow-md border border-gray-200 hover:scale-110 hover:shadow-xl transition-all">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="8" fill="#FBBC04" />
            <rect x="14" y="14" width="20" height="20" rx="2" fill="white" />
            <rect x="16" y="20" width="16" height="2" fill="#FBBC04" />
            <rect x="16" y="24" width="12" height="2" fill="#FBBC04" />
          </svg>
        </div>
      </div>

      {/* Canva - Bottom */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{ zIndex: 2 }}
      >
        <div className="bg-white rounded-full p-3 shadow-md border border-gray-200 hover:scale-110 hover:shadow-xl transition-all">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="8" fill="#00C4CC" />
            <path
              d="M24 12c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4s4-1.8 4-4V16c0-2.2-1.8-4-4-4z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* OpenAI - Left */}
      <div
        className="absolute top-1/2 left-12 -translate-y-1/2"
        style={{ zIndex: 2 }}
      >
        <div className="bg-white rounded-full p-3 shadow-md border border-gray-200 hover:scale-110 hover:shadow-xl transition-all">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="#10A37F" />
            <path
              d="M24 14v20M14 24h20"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
