// components/NavigationBar.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationToast from "./NotificationToast";

export default function NavigationBar({ onNavigate, currentView, selectedProjectId, navProjects, setNavProjects, onOpenSettings, onOpenDeleteModal, setRefreshTrigger }) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  const [openDropdown, setOpenDropdown] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleHomeClick = () => onNavigate("home");
  const handleProjectClick = (projectId) => onNavigate("project", projectId);

  // 🔹 Load projects from backend on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return; // unauthorized or error, silently fail for now

        const data = await res.json();
        
        // Sort by recency (most recently updated first)
        const sorted = [...data].sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bDate - aDate;
        });

        // Map backend projects into navProjects shape
        const mapped = sorted.map((p, index) => ({
          id: p._id, // use Mongo _id as the stable project id
          number: `#${index + 1}`,
          name: p.name || `Project ${index + 1}`,
        }));
        setNavProjects(mapped);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }

    loadProjects();
  }, [setNavProjects]);

  function addProject() {
    // Create temporary ID for instant UI update
    const tempId = `temp-${Date.now()}`;
    const newProjectName = `Project ${navProjects.length + 1}`;

    // Update UI immediately
    setNavProjects((prev) => [
      ...prev,
      {
        id: tempId,
        number: `#${prev.length + 1}`,
        name: newProjectName,
      },
    ]);

    // Navigate to the new project immediately
    try {
      onNavigate("project", tempId);
    } catch {}

    // Create project in background
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProjectName,
        nextTrigger: "",
        prevTrigger: "",
        queue: [],
        advancedEnabled: false,
        pptxUrl: null,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to create project");
          return;
        }
        const created = await res.json();
        const realId = created._id;

        // Replace temp ID with real ID from backend
        setNavProjects((prev) =>
          prev.map((p) =>
            p.id === tempId
              ? { ...p, id: realId, name: created.name || newProjectName }
              : p
          )
        );

        // Update navigation to use real ID
        try {
          onNavigate("project", realId);
        } catch {}

        // Trigger refresh of project views
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((err) => {
        console.error("Error creating project:", err);
      });
  }

  function handleEdit(project) {
    setEditingProjectId(project.id);
    setEditingName(project.name);
    setOpenDropdown(null);
  }

  function handleDoubleClick(project) {
    handleEdit(project);
  }

  function saveEdit() {
    if (editingProjectId && editingName.trim()) {
      const newName = editingName.trim();
      
      // Find the original project to check if name actually changed
      const originalProject = navProjects.find((p) => p.id === editingProjectId);
      const nameChanged = originalProject && originalProject.name !== newName;

      // Only persist to backend if name actually changed
      if (nameChanged) {
        // Update UI immediately and move to top
        setNavProjects((prev) => {
          const updatedProjects = prev.map((p) => 
            p.id === editingProjectId ? { ...p, name: newName } : p
          );
          // Move the edited project to the top (most recent)
          const editedProject = updatedProjects.find(p => p.id === editingProjectId);
          const otherProjects = updatedProjects.filter(p => p.id !== editingProjectId);
          return editedProject ? [editedProject, ...otherProjects] : updatedProjects;
        });

        fetch(`/api/projects/${editingProjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        })
          .then(() => {
            // Trigger refresh of project views after successful save
            setRefreshTrigger((prev) => prev + 1);
          })
          .catch((err) => {
            console.error("Failed to save project name:", err);
          });
      } else {
        // Name didn't change, just update UI without moving
        setNavProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? { ...p, name: newName } : p))
        );
      }
    }
    setEditingProjectId(null);
    setEditingName("");
  }

  function cancelEdit() {
    setEditingProjectId(null);
    setEditingName("");
  }

  function handleDeleteClick(project) {
    setOpenDropdown(null);
    if (onOpenDeleteModal) {
      onOpenDeleteModal(project);
    }
  }

  // Focus input when editing starts
  useEffect(() => {
    if (editingProjectId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingProjectId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <nav className="fixed left-0 top-0 h-screen w-72 bg-[#2a3958]/50 border-r border-white/10 shadow-[0_18px_45px_rgba(10,20,70,0.75)] flex flex-col p-5 rounded-tr-3xl rounded-br-3xl">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-9 px-2">
        <div className="w-10 h-10 bg-linear-to-br from-[#4A6FE5] to-[#3956C4] rounded-lg flex items-center justify-center border border-white/8 p-1.5">
          <img 
            src="/vf-icon.png" 
            alt="VoiceFlow" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-lg font-semibold text-white">VoiceFlow</span>
      </div>

      {/* Home Button */}
      <button
        onClick={handleHomeClick}
        aria-label="Go home"
        className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-6 transition-colors duration-150 ease-out ${
          currentView === "home" ? "bg-indigo-500/20 text-indigo-300" : "text-white/80 hover:bg-[#d4e0ff]/10 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-3 px-3">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Projects</h3>
        </div>

        <div className="space-y-1 px-1">
          <AnimatePresence mode="popLayout">
          {navProjects.map((project, index) => {
            const active = currentView === "project" && selectedProjectId === project.id;
            const isEditing = editingProjectId === project.id;
            const showDots = active || openDropdown === project.id;
            const displayNumber = `#${index + 1}`;
            
            return (
              <motion.div
                key={project.id}
                layout
                className="relative group"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => !isEditing && handleProjectClick(project.id)}
                    onDoubleClick={() => !isEditing && handleDoubleClick(project)}
                    className={`flex-1 flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out ${
                      active ? "bg-indigo-500/20 text-indigo-300" : "text-white/80 hover:bg-[#d4e0ff]/10 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{displayNumber}</span>
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        onBlur={saveEdit}
                        className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="flex-1 text-sm font-medium truncate text-left">{project.name}</span>
                    )}
                  </button>
                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === project.id ? null : project.id);
                      }}
                      className={`absolute right-2 p-1 rounded hover:bg-white/10 transition-opacity ${
                        showDots ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                      </svg>
                    </button>
                  )}
                </div>
                {openDropdown === project.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-2 top-full mt-1 w-32 rounded-lg border border-white/10 backdrop-blur-xl z-50 py-1 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #344064 0%, #344064 100%)' }}
                  >
                    <button
                      onClick={() => handleEdit(project)}
                      className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
          </AnimatePresence>
          <motion.div className="px-1 mt-2" layout transition={{ duration: 0.3, ease: "easeOut" }}>
            <button
              onClick={addProject}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-white/12 rounded-md text-sm font-medium text-white shadow-sm hover:bg-white/10 cursor-pointer transition-colors"
              aria-label="Create new project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">New project</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/8 pt-4 mt-4 space-y-1">
        {/* Settings */}
        <button
          onClick={() => onOpenSettings && onOpenSettings()}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out text-white/80 hover:bg-[#d4e0ff]/10 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Settings</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setNotifOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out text-white/80 hover:bg-[#d4e0ff]/10 hover:text-white"
        >
          <span className="relative inline-flex">
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            <svg className="relative w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </span>
          <span className="text-sm font-medium">Notifications</span>
        </button>

        {/* Profile */}
       <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#d4e0ff]/10">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold border border-white/10">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white truncate">{userName}</span>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out text-white/80 hover:bg-[#d4e0ff]/10 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Notification Toast */}
      <NotificationToast open={notifOpen} onClose={() => setNotifOpen(false)} />
    </nav>
  );
}
