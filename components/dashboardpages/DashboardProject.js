// components/dashboardpages/DashboardProject.js
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import PresentationControlsProject from "../PresentationContolsProject";
import ProjectViewProject from "../ProjectviewProject";

export default function DashboardProject({
  projectId,
  projectName,
  onOpenProject,
  refreshTrigger,
}) {
  const [nextSlideWord, setNextSlideWord] = useState("");
  const [prevSlideWord, setPrevSlideWord] = useState("");

  const controlsRef = useRef(null);
  const [controlsHeight, setControlsHeight] = useState(null);

  useLayoutEffect(() => {
    function updateHeight() {
      if (controlsRef.current) {
        setControlsHeight(controlsRef.current.offsetHeight);
      }
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 lg:p-1">
      {/* Big wrapping card */}
      <div className="flex-1 rounded-2xl bg-[#2a3958]/7 shadow-4xl backdrop-blur-sm border border-white/10 flex flex-col gap-6 p-6 md:p-8">
        {/* Title row */}
        <div className="w-full flex-none">
        <h1 className="text-3xl md:text-3xl font-semibold tracking-normal text-slate-900 dark:text-slate-50">
          Your Projects
        </h1>
        </div>

        {/* Content grid inside the card (mirrors DashboardHome layout) */}
        <div className="flex flex-col xl:flex-row gap-4 w-full flex-1 min-h-0">
          {/* Left Column: ProjectViewProject (top) */}
          <div className="basis-1/3 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <ProjectViewProject
                maxHeight={controlsHeight}
                currentProjectId={projectId}
                onOpenProject={onOpenProject}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>

          {/* Right Column: PresentationControlsProject (uses project-specific controls) */}
          <div className="basis-2/3 flex flex-col min-h-0">
            <div className="flex-1 min-h-0" ref={controlsRef}>
              <PresentationControlsProject
                projectId={projectId}
                projectName={projectName}
                onNextSlideWordChange={setNextSlideWord}
                onPrevSlideWordChange={setPrevSlideWord}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
