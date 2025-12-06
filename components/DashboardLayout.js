// components/DashboardLayout.js
"use client";

import { useState } from "react";
import NavigationBar from "./NavigationBar";
import DashboardHome from "./dashboardpages/DashboardHome";
import DashboardProject from "./dashboardpages/DashboardProject";
import { SettingsModal, DeleteConfirmModal } from "./Modal";



export default function DashboardLayout() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

 const [navProjects, setNavProjects] = useState([
   { id: 1, number: "#1", name: "Project 1" },
   { id: 2, number: "#2", name: "Project 2" },
   { id: 3, number: "#3", name: "Project 3" },
 ]);
 const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNavigation = (view, projectId = null) => {
    if (view === "home") {
      setCurrentView("home");
      setSelectedProject(null);
    } else if (view === "project" && projectId) {
      const project = navProjects.find(p => p.id === projectId);
      if (project) {
        setCurrentView("project");
        setSelectedProject(project);
      }
    }
    // ignore other view types for now
  };

  function openProjectById(projectId) {
  const proj = navProjects.find((p) => p.id === projectId) || null;

  if (proj) {
    setSelectedProject(proj);
    setCurrentView("project");
  }
}

  return (
<div className="relative min-h-screen w-full overflow-hidden">
  {/* Blurred abstract background */}
  <div
    className="pointer-events-none fixed inset-0"
    style={{
      backgroundImage: `
        /* small diagonal band – top-left */
        linear-gradient(
          135deg,
          rgba(27, 36, 63, 0.95) 0%,
          rgba(27, 36, 63, 0.95) 50%,
          transparent 50%,
          transparent 100%
        ),
        /* small diagonal band – top-right */
        linear-gradient(
          225deg,
          rgba(27, 36, 63, 0.9) 0%,
          rgba(27, 36, 63, 0.9) 50%,
          transparent 50%,
          transparent 100%
        ),
        /* small diagonal band – bottom-left */
        linear-gradient(
          315deg,
          rgba(27, 36, 63, 0.85) 0%,
          rgba(27, 36, 63, 0.85) 45%,
          transparent 45%,
          transparent 100%
        ),
        /* small diagonal band – bottom-right */
        linear-gradient(
          45deg,
          rgba(27, 36, 63, 0.9) 0%,
          rgba(27, 36, 63, 0.9) 45%,
          transparent 45%,
          transparent 100%
        ),
        /* central rectangle-ish band */
        linear-gradient(
          0deg,
          rgba(31, 41, 76, 0.85) 0%,
          rgba(31, 41, 76, 0.85) 40%,
          transparent 40%,
          transparent 100%
        ),
        /* subtle dot / cell pattern 1 */
        repeating-radial-gradient(
          circle at 0 0,
          rgba(255, 255, 255, 0.06) 0px,
          rgba(255, 255, 255, 0.06) 1px,
          transparent 1px,
          transparent 6px
        ),
        /* subtle dot / cell pattern 2 (offset) */
        repeating-radial-gradient(
          circle at 3px 3px,
          rgba(255, 255, 255, 0.04) 0px,
          rgba(255, 255, 255, 0.04) 1px,
          transparent 1px,
          transparent 6px
        ),
        /* light blobs tuned to the new palette */
        radial-gradient(
          circle at 10% 15%,
          rgba(72, 87, 134, 0.45) 0,
          transparent 55%
        ),
        radial-gradient(
          circle at 85% 10%,
          rgba(82, 99, 152, 0.35) 0,
          transparent 55%
        ),
        radial-gradient(
          circle at 0% 80%,
          rgba(70, 86, 137, 0.35) 0,
          transparent 55%
        ),
        radial-gradient(
          circle at 80% 85%,
          rgba(60, 76, 126, 0.45) 0,
          transparent 60%
        ),
        /* base filler gradient around #2a3552 */
        linear-gradient(
          135deg,
          #2a3552 0%,
          #252f49 40%,
          #212a44 100%
        )
      `,
      backgroundRepeat:
        'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
      backgroundSize:
        '32% 32%, 32% 32%, 30% 30%, 30% 30%, 55% 55%, 12px 12px, 12px 12px, cover, cover, cover, cover, cover',
      backgroundPosition:
        '0% 0%, 100% 0%, 0% 100%, 100% 100%, 50% 50%, 0 0, 6px 6px, center, center, center, center, center',
      filter: 'blur(10px)',
      transform: 'scale(1.1)',
    }}
  />
      <NavigationBar 
        onNavigate={handleNavigation}
        currentView={currentView}
        selectedProjectId={selectedProject?.id || null}
        navProjects={navProjects}
        setNavProjects={setNavProjects}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenDeleteModal={(project) => {
          setProjectToDelete(project);
          setDeleteModalOpen(true);
        }}
        setRefreshTrigger={setRefreshTrigger}
      />
      <div className="ml-72 flex-1 p-6 flex items-center justify-center">
        {currentView === "home" && (
  <DashboardHome onOpenProject={openProjectById} refreshTrigger={refreshTrigger} />
)}
        {currentView === "project" && selectedProject && (
        <DashboardProject
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          onOpenProject={openProjectById}
          refreshTrigger={refreshTrigger}
        />
        )}
      </div>

      {/* Modals - Render at root level to cover entire screen */}
      <SettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={(deletedProjectId) => {
          // Actually delete the project in local state
          setNavProjects((prev) => prev.filter((p) => p.id !== deletedProjectId));
          // Navigate to home if we're deleting the currently selected project
          if (selectedProject?.id === deletedProjectId) {
            setCurrentView("home");
            setSelectedProject(null);
          }
          // Trigger refresh of project views
          setRefreshTrigger(prev => prev + 1);
          setProjectToDelete(null);
        }}
        projectTitle={projectToDelete?.name || ""}
        projectId={projectToDelete?.id}   // 👈 add this line
      />
    </div>
  );
}
