// components/dashboardpages/DashboardHome.js
"use client";

import { useState } from "react";
import PresentationControls from "../PresentationControls";
import Commands from "../Commands";
import ProjectView from "../ProjectView";
import ProfileView from "../ProfileView";
import QuoteView from "../QuoteView";

export default function DashboardHome({ onOpenProject, refreshTrigger }) {
  const [nextSlideWord, setNextSlideWord] = useState("");
  const [prevSlideWord, setPrevSlideWord] = useState("");

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 lg:p-1">
      {/* Big wrapping card */}
      <div className="flex-1 rounded-2xl bg-[#2a3958]/7 shadow-4xl backdrop-blur-xl border border-white/10 flex flex-col gap-6 p-6 md:p-8">
        {/* Title row */}
        <div className="w-full flex-none">
          <h1 className="text-3xl md:text-3xl font-semibold tracking-normal text-slate-900 dark:text-slate-50">
            Home
          </h1>
        </div>

        {/* Content grid inside the card */}
        <div className="flex flex-col xl:flex-row gap-4 w-full flex-1">
          {/* Left Column: ProjectView (top) / ProfileView (bottom) */}
          <div className="basis-1/3 flex flex-col gap-4">
            <div className="flex-1">
            <ProjectView onOpenProject={onOpenProject} refreshTrigger={refreshTrigger} />
            </div>
            <div className="flex-1">
              <ProfileView />
            </div>
          </div>

          {/* Right Column: PresentationControls (top) / QuoteView (bottom) */}
          <div className="basis-2/3 flex flex-col gap-4">
            <div className="flex-3">
              <PresentationControls
                onNextSlideWordChange={setNextSlideWord}
                onPrevSlideWordChange={setPrevSlideWord}
              />
            </div>

            <div className="flex-1">
              <QuoteView />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
