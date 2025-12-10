"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function FeedbackModal({ 
  open, 
  onClose, 
  userEmail, 
  customTitle = "Share Your Feedback",
  customSubtitle = "Help us improve VoiceFlow"
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setTimeout(() => {
        setName("");
        setMessage("");
        setSubmitStatus(null);
      }, 200);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          email: userEmail || "Anonymous",
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          onClose();
        }, 4500);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  const modal = (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full min-w-[38rem] rounded-2xl border border-white/10 backdrop-blur-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #28335080 0%, #32416A80 100%)",
          boxShadow: "0 18px 45px rgba(10,20,70,0.75)",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">{customTitle}</h2>
            <p className="text-sm text-white/60 mt-1">
              {customSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close feedback modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback-name" className="block text-sm font-medium text-white/90 mb-2">
              Your Name
            </label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-lg text-white text-sm placeholder:text-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #324162 0%, #283554 100%)",
              }}
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-white/90 mb-2">
              Your Message
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind."
              required
              disabled={isSubmitting}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg text-white text-sm placeholder:text-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #324162 0%, #283554 100%)",
              }}
            />
          </div>

          {submitStatus === "success" && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Thank you! We successfully received your input.</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Failed to send. Please try again.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #324162 0%, #283554 100%)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );

  // Render via portal to escape stacking contexts
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }
  return modal;
}

function ModalOverlay({ children, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
