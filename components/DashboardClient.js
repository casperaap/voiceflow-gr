// components/DashboardLayout.js
"use client";

import { useState } from "react";
import NavigationBar from "./NavigationBar";
import DashboardHome from "./dashboardpages/DashboardHome";
import DashboardProject from "./dashboardpages/DashboardProject";

export default function DashboardLayout() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);

  const navProjects = [
    { id: 1, number: "#1", name: "Project 1" },
    { id: 2, number: "#2", name: "Project 2" },
    { id: 3, number: "#3", name: "Project 3" },
  ];

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
    // Ignore other views (settings, notifications, logout) for now
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      <NavigationBar 
        onNavigate={handleNavigation}
        currentView={currentView}
        selectedProjectId={selectedProject?.id || null}
      />
      <div className="ml-72 flex-1 p-6 flex items-center justify-center">
        {currentView === "home" && <DashboardHome />}
        {currentView === "project" && selectedProject && (
            <DashboardProject
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            onOpenProject={openProjectById}   // 👈 add this
          />
        )}
      </div>
    </div>
  );
}
