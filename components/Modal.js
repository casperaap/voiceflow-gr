"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";

export function SettingsModal({ open, onClose }) {
    async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        // Go to Stripe's billing portal
        window.location.href = data.url;
      } else if (data.redirectTo) {
        // No Stripe customer yet → e.g. send them to subscribe
        window.location.href = data.redirectTo;
      } else {
        console.error("No portal url returned", data);
      }
    } catch (err) {
      console.error("Error creating portal session", err);
    }
  }
  if (!open) return null;
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-white/10 backdrop-blur-2xl p-6"
           style={{ background: 'linear-gradient(135deg, #28335080 0%, #32416A80 100%)', boxShadow: '0 18px 45px rgba(10,20,70,0.75)' }}>
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close settings modal"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleManageSubscription}
            className="w-full px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'linear-gradient(180deg, #324162 0%, #283554 100%)' }}
          >
            Manage subscription
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  projectTitle,
  projectId,        // 👈 NEW: id of the project to delete
}) {
  if (!open) return null;

  async function handleDelete() {
    // Close modal immediately for instant feedback
    onClose();

    // Delete from backend first
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      // After successful delete, update UI
      if (onConfirm) {
        onConfirm(projectId);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
      // you could show a toast/error here later
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 backdrop-blur-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, #28335080 0%, #32416A80 100%)",
          boxShadow: "0 18px 45px rgba(10,20,70,0.75)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Delete Project</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close delete confirmation"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-white/70 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-white">{projectTitle}</span>? This
          action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #324162 0%, #283554 100%)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete} // 👈 use the async handler
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/30 text-red-200 border border-red-500/40 hover:bg-red-500/40 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalOverlay({ children, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
