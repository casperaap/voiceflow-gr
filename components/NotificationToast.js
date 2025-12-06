// components/NotificationToast.js
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationToast({ open, onClose, duration = 30000 }) {
  const [visible, setVisible] = useState(!!open);

  useEffect(() => {
    setVisible(!!open);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(id);
  }, [visible, duration, onClose]);

  const toast = (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="group fixed top-4 right-4 z-50 w-88 max-w-[92vw] rounded-t-xl border border-white/10 bg-[#344064] text-white shadow-xl"
          style={{ boxShadow: "0 18px 45px rgba(10,20,70,0.55)" }}
          role="status"
          aria-live="polite"
        >
          <div className="relative p-4">
            <button
              aria-label="Close notification"
              onClick={() => {
                setVisible(false);
                onClose?.();
              }}
              className="absolute top-2.5 right-2.5 h-7 w-7 grid place-items-center rounded-md bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-opacity opacity-0 group-hover:opacity-100"
            >
              ×
            </button>

            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <span className="absolute -inset-1 rounded-full bg-emerald-400/25 blur-sm" />
                <div className="relative h-8 w-8 rounded-full bg-emerald-500/25 grid place-items-center border border-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M10 3a2 2 0 1 1 4 0v1.07A7.002 7.002 0 0 1 19 11v3.159l1.405 1.405A1 1 0 0 1 19.999 17H4a1 1 0 0 1-.707-1.707L4.7 14.592V11a7.002 7.002 0 0 1 5-6.93V3Z" />
                    <path d="M9 19a3 3 0 0 0 6 0H9Z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-semibold leading-tight">Welcome to VoiceFlow</h4>
                <p className="mt-1 text-sm text-white/85">
                  Voice‑controlled powerpoints are the future. Help us create a flawless experience by filling out our feedback form!
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
                  <span>Sent • 1 December 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-1 w-full bg-white/10">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="h-full bg-emerald-400/70"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render via portal to escape stacking contexts
  if (typeof document !== "undefined") {
    return createPortal(toast, document.body);
  }
  return toast;
}
