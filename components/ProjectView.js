// components/ProjectView.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes <= 5) return "Now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function getFileNameFromUrl(url) {
  if (!url) return "No file selected";
  try {
    const withoutQuery = url.split("?")[0];
    const parts = withoutQuery.split("/");
    const last = parts[parts.length - 1];
    return last || "No file selected";
  } catch {
    return "No file selected";
  }
}

function computeCompletion(project) {
  if (!project) return 0;

  let total = 0;
  let filled = 0;

  // nextTrigger
  total += 1;
  if (project.nextTrigger && project.nextTrigger.trim() !== "") {
    filled += 1;
  }

  // prevTrigger
  total += 1;
  if (project.prevTrigger && project.prevTrigger.trim() !== "") {
    filled += 1;
  }

  // stopTrigger
  total += 1;
  if (project.stopTrigger && project.stopTrigger.trim() !== "") {
    filled += 1;
  }

  // queue
  total += 1;
  if (Array.isArray(project.queue) && project.queue.length > 0) {
    filled += 1;
  }

  // pptxUrl (file uploaded)
  total += 1;
  if (project.pptxUrl && project.pptxUrl.trim() !== "") {
    filled += 1;
  }

  if (total === 0) return 0;
  const pct = Math.round((filled / total) * 100);
  return Math.min(100, Math.max(0, pct));
}

export default function ProjectView({ onOpenProject, refreshTrigger }) {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          console.error("Failed to fetch projects for ProjectView");
          return;
        }
        const data = await res.json();

        // Sort by last edited (updatedAt), fallback to createdAt, then take top 3
        const sorted = [...data].sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bDate - aDate;
        });

        setProjects(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error loading recent projects:", err);
      }
    }

    loadProjects();
  }, [refreshTrigger]);

  return (
    <div
      className="w-full h-full rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_18px_45px_rgba(10,20,70,0.75)]"
      style={{
        background: "linear-gradient(135deg, #28335080 0%, #32416A80 100%)",
        padding: "24px 28px",
        boxShadow: "0 18px 45px #2B74700D ",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 2l9 4.5-9 4.5-9-4.5L12 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 11.5l-9 4.5-9-4.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 17l-9 4.5L3 17"
            />
          </svg>
          <h3 className="text-white font-semibold text-[20px]">
            Recent Projects
          </h3>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-sm text-white/60 mt-4">
          No recent projects yet.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
          {projects.map((p) => {
            const id = p._id || p.id;
            const isSelected = selectedId === id;
            const timeLabel = formatRelativeTime(p.updatedAt || p.createdAt);
            const subtitle = getFileNameFromUrl(p.pptxUrl);
            const pct = computeCompletion(p);

            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={() => {
                  setSelectedId(id);
                  if (onOpenProject) {
                    onOpenProject(id);
                  }
                }}
                className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ease-out cursor-pointer ${
                  isSelected
                    ? "border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    : "border-white/5 hover:border-white/20 hover:shadow-[0_8px_16px_rgba(255,255,255,0.08)]"
                }`}
                style={{
                  background: isSelected
                    ? "linear-gradient(180deg, #3d4d7a 0%, #2f3d5e 100%)"
                    : "linear-gradient(180deg, #324162 0%, #283554 100%)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-medium text-[17px]">
                      {p.name || p.title || "Untitled project"}
                    </div>
                    <div className="text-xs text-white/60 mt-2 mb-2">
                      {subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6l4 2"
                      />
                    </svg>
                    <span>{timeLabel}</span>
                  </div>
                </div>

                <div
                  className="w-full bg-[#050816]/25 rounded-full overflow-hidden mb-2"
                  style={{ height: "6px" }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: `${pct}%`,
                      height: "6px",
                      background:
                        "linear-gradient(135deg, #53C1BC 0%, #3FA29E 45%, #2B7470 100%)",
                    }}
                  />
                </div>

                <div className="text-xs text-white/70">
                  {pct}% Complete
                </div>
              </motion.button>
            );
          })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
