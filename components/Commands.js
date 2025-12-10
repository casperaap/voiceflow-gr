// components/Commands.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { FeedbackModal } from "./FeedbackModal";
import { useSession } from "next-auth/react";

/**
 * Controlled Commands component.
 * - If `prefix` / `commands` and their onChange handlers are provided, acts as controlled inputs.
 * - Otherwise, falls back to internal state (useful for standalone usage).
 */
export default function Commands({
  prefix,
  onPrefixChange,
  commands: commandsProp,
  onCommandsChange,
}) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const defaultCommands = useMemo(
    () => [
      {
        id: 1,
        name: "Black screen",
        description: "Shows a black (or other color) screen.",
        enabled: false,
      },
      {
        id: 2,
        name: "Timer",
        description: "Starts a countdown timer.",
        enabled: false,
      },
      {
        id: 3,
        name: "Specific Slide",
        description: "Goes to a specific slide of preference.",
        enabled: false,
      },
    ],
    []
  );

  const isControlledPrefix = typeof prefix === "string" && typeof onPrefixChange === "function";
  const isControlledCommands = Array.isArray(commandsProp) && typeof onCommandsChange === "function";

  const [commandPrefix, setCommandPrefix] = useState(prefix ?? "");
  const [commands, setCommands] = useState(commandsProp ?? defaultCommands);

  // Keep internal state in sync when controlled props change
  useEffect(() => {
    if (prefix !== undefined) setCommandPrefix(prefix);
  }, [prefix]);
  useEffect(() => {
    if (commandsProp !== undefined) setCommands(commandsProp);
  }, [commandsProp]);

  const handlePrefixChange = (value) => {
    if (isControlledPrefix) onPrefixChange(value);
    else setCommandPrefix(value);
  };

  const toggleCommand = (id) => {
    const updater = (prev) =>
      prev.map((cmd) => (cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd));

    if (isControlledCommands) {
      onCommandsChange(updater(commands));
    } else {
      setCommands(updater);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Command Prefix */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden
          >
            <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
          </svg>
          <h3 className="text-white font-semibold text-[20px]">Commands</h3>
        </div>
        <label className="block text-sm font-medium text-white mb-2">
          Command Prefix
        </label>
        <input
          id="command-prefix"
          type="text"
          placeholder={`e.g., "Hey powerpoint"`}
          value={commandPrefix}
          onChange={(e) => handlePrefixChange(e.target.value)}
          className="w-full px-3 py-2 border border-white/12 rounded-md bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300/70"
        />
      </div>

      {/* Commands List */}
      <div>
        <h3 className="block text-sm font-medium text-white mb-3">
          Available Commands
        </h3>
        <div className="flex flex-row flex-wrap gap-3">
          {commands.map((command) => (
            <div
              key={command.id}
              className="w-[180px] flex flex-col gap-2 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/5 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-50">
                  {command.name}
                </h4>
                <button
                  onClick={() => toggleCommand(command.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    command.enabled
                      ? "bg-linear-to-r from-[#53C1BC] to-[#2B7470]"
                      : "bg-slate-600"
                  }`}
                  role="switch"
                  aria-checked={command.enabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      command.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {command.description}
              </p>
            </div>
          ))}

          {/* Request New Command Card */}
          <button
            onClick={() => setRequestModalOpen(true)}
            className="w-[180px] flex flex-col gap-2 p-4 border-2 border-dashed border-emerald-500/40 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-center mb-1">
              <svg
                className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h4 className="text-[0.75rem] font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors text-center">
              Request New Command
            </h4>
          </button>
        </div>
      </div>

      {/* Request Command Modal */}
      <FeedbackModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        userEmail={userEmail}
        customTitle="Request New Command"
        customSubtitle="Tell us what command you'd like to see and we'll build it for you!"
      />
    </div>
  );
}
