// components/PresentationControlsProject.js
"use client";

import { useRef, useState } from "react";
import Commands from "./Commands";
import { useEffect } from "react"; 

export default function PresentationControlsProject({ projectId, projectName }) {
  const fileInputRef = useRef(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  function ensureOverlay() {
    let el = document.getElementById("pptx-viewer-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "pptx-viewer-root";
      el.tabIndex = 0;
      Object.assign(el.style, {
        position: "fixed",
        inset: "0",
        background: "#000",
        overflow: "hidden",
        padding: "0",
        margin: "0",
        zIndex: "9999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      });
      document.body.appendChild(el);
    }
    return el;
  }

  function loadPptxPreviewUMD() {
    return new Promise((resolve, reject) => {
      if (window.pptxPreview) return resolve(window.pptxPreview);
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/pptx-preview@1.0.7/dist/pptx-preview.umd.js";
      s.onload = () => resolve(window.pptxPreview);
      s.onerror = () => reject(new Error("Failed to load pptx-preview"));
      document.head.appendChild(s);
    });
  }

  // ---- helpers for partial handling ----
  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const countWholeWord = (text, word) => {
    if (!word) return 0;
    const re = new RegExp(`\\b${escapeRegExp(word)}\\b`, "g");
    const m = text.match(re);
    return m ? m.length : 0;
  };

  async function handleStart() {
    setError(null);
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please upload a .pptx first.");
      return;
    }

    setIsBusy(true);

    let ws = null,
      stream = null,
      ctx = null,
      src = null,
      proc = null,
      gain = null;
    let closed = false;
    let pendingTimeouts = [];
    
    let commandListening = false;
    let commandBuffer = "";
    let commandSilenceTimeout = null;
    let commandMaxTimeout = null;
    let commandStartTime = null;
    
    

    // Overlays for commands
    let listeningIndicatorEl = null;
    let timerOverlayEl = null;
    let timerIntervalId = null;
    let timerRemainingSeconds = 0;
    let commandScreenOverlayEl = null;
    let noCommandNoticeEl = null;
    let noCommandNoticeTimeout = null;

    try {
      const file = input.files[0];
      const buf = await file.arrayBuffer();

      const pptxPreview = await loadPptxPreviewUMD();
      const overlay = ensureOverlay();
      overlay.innerHTML = "";
      overlay.focus();

      // Render slides
      const viewer = pptxPreview.init(overlay, { width: 1920, height: 1080 });
      await viewer.preview(buf);

      // Locate slide nodes and show one-at-a-time
      const container =
        overlay.querySelector(".pptx-viewer, .pptx-preview, .pptx-container") ||
        overlay.firstElementChild ||
        overlay;

      let slides = Array.from(
        container.querySelectorAll(".pptx-slide, .pptx-preview__slide, .slide, section")
      );
      if (!slides.length) slides = Array.from(container.children);
      slides = slides.filter((el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE");
      if (!slides.length) return;

      let idx = 0;
      slides.forEach((el, i) => {
        el.style.display = i === 0 ? "block" : "none";
        el.style.margin = "0 auto";
        el.style.maxWidth = "100%";
        el.style.maxHeight = "100%";
      });
      function show(i) {
        const n = slides.length;
        if (!n) return;
        slides[idx].style.display = "none";
        idx = Math.max(0, Math.min(i, n - 1));
        slides[idx].style.display = "block";
      }

// COMMAND LOGIC BIG SNIPPET START
      function showListeningIndicator() {
        if (!listeningIndicatorEl) return;
        listeningIndicatorEl.style.display = "flex";
      }

      function hideListeningIndicator() {
        if (!listeningIndicatorEl) return;
        listeningIndicatorEl.style.display = "none";
      }

      // Tiny "Listening..." badge in the top-right of the overlay
      listeningIndicatorEl = document.createElement("div");
      listeningIndicatorEl.id = "command-listening-indicator";
      Object.assign(listeningIndicatorEl.style, {
        position: "absolute",
        top: "16px",
        right: "16px",
        padding: "6px 10px",
        borderRadius: "999px",
        background: "rgba(15,23,42,0.85)",
        color: "white",
        fontSize: "12px",
        fontWeight: "500",
        display: "none",
        alignItems: "center",
        gap: "6px",
        zIndex: "10000",
      });
      listeningIndicatorEl.innerHTML = `
        <span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:#22c55e;margin-right:4px;"></span>
        Listening...
      `;
      overlay.appendChild(listeningIndicatorEl);

      // Small "no command" notice at the bottom center
      function showNoCommandNotice(message) {
        if (!overlay) return;

        if (!noCommandNoticeEl) {
          noCommandNoticeEl = document.createElement("div");
          Object.assign(noCommandNoticeEl.style, {
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "rgba(15,23,42,0.9)",
            color: "white",
            fontSize: "12px",
            fontWeight: "500",
            boxShadow: "0 10px 30px rgba(15,23,42,0.7)",
            zIndex: "10000",
            display: "none",
            whiteSpace: "nowrap",
          });
          noCommandNoticeEl.textContent = message || "We didn't register any command.";
          overlay.appendChild(noCommandNoticeEl);
        }

        noCommandNoticeEl.style.display = "block";

        if (noCommandNoticeTimeout) clearTimeout(noCommandNoticeTimeout);
        noCommandNoticeTimeout = setTimeout(() => {
          if (noCommandNoticeEl) {
            noCommandNoticeEl.style.display = "none";
          }
        }, 3000); // visible for 3s
      }

      // Timer overlay (small pill, top-left)
      function updateTimerOverlay() {
        if (!timerOverlayEl) return;
        const m = Math.floor(timerRemainingSeconds / 60);
        const s = timerRemainingSeconds % 60;
        const label = `${m}:${s.toString().padStart(2, "0")}`;
        timerOverlayEl.textContent = label;
      }

      function stopTimerOverlay() {
        if (timerIntervalId != null) {
          clearInterval(timerIntervalId);
          timerIntervalId = null;
        }
        timerRemainingSeconds = 0;
        if (timerOverlayEl && timerOverlayEl.parentNode) {
          timerOverlayEl.parentNode.removeChild(timerOverlayEl);
        }
        timerOverlayEl = null;
      }

      function startTimerOverlay(seconds) {
        if (!overlay || !seconds || seconds <= 0) return;
        stopTimerOverlay();
        timerRemainingSeconds = Math.floor(seconds);

        timerOverlayEl = document.createElement("div");
        Object.assign(timerOverlayEl.style, {
          position: "absolute",
          top: "16px",
          left: "16px",
          padding: "16px 24px",
          borderRadius: "999px",
          background: "rgba(15,23,42,0.9)",
          color: "white",
          fontSize: "36px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          zIndex: "10000",
          fontFamily: "monospace",
          minWidth: "140px",
          textAlign: "center",
        });
        overlay.appendChild(timerOverlayEl);
        updateTimerOverlay();

        timerIntervalId = window.setInterval(() => {
          timerRemainingSeconds -= 1;
          if (timerRemainingSeconds <= 0) {
            stopTimerOverlay();
            return;
          }
          updateTimerOverlay();
        }, 1000);
      }

      // Black/white screen overlay
      function showScreenOverlay(color) {
        if (!overlay) return;
        const bg = (color || "black").toLowerCase();
        if (!commandScreenOverlayEl) {
          commandScreenOverlayEl = document.createElement("div");
          Object.assign(commandScreenOverlayEl.style, {
            position: "absolute",
            inset: "0",
            background: bg,
            zIndex: "9000",
          });
          overlay.appendChild(commandScreenOverlayEl);
        } else {
          commandScreenOverlayEl.style.background = bg;
          commandScreenOverlayEl.style.display = "block";
        }
      }

      function hideScreenOverlay() {
        if (commandScreenOverlayEl) {
          commandScreenOverlayEl.style.display = "none";
        }
      }

      // Command capture helpers
      function resetCommandCapture() {
        if (commandSilenceTimeout) clearTimeout(commandSilenceTimeout);
        if (commandMaxTimeout) clearTimeout(commandMaxTimeout);
        commandSilenceTimeout = null;
        commandMaxTimeout = null;
        commandListening = false;
        commandBuffer = "";
        commandStartTime = null;
        hideListeningIndicator();
      }

      function finalizeCommandCapture() {
        if (!commandListening) return;
        const textToSend = commandBuffer.trim();
        resetCommandCapture();
        if (!textToSend || closed) return;

        // Send to command route
        fetch("/api/commands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToSend }),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((cmd) => {
            if (!cmd || closed) return;
            handleCommandResult(cmd);
          })
          .catch((err) => {
            console.error("Command route error", err);
          });
      }

      function scheduleSilenceTimeout() {
        if (!commandListening) return;

        const now = Date.now();
        // Grace period: for the first 900ms after the prefix, do NOT treat silence as "end of command"
        if (commandStartTime && now - commandStartTime < 900) {
          return;
        }

        if (commandSilenceTimeout) clearTimeout(commandSilenceTimeout);
        commandSilenceTimeout = setTimeout(() => {
          finalizeCommandCapture();
        }, 500); // actual silence window once grace period is over
      }

      function scheduleMaxTimeout() {
        if (commandMaxTimeout) clearTimeout(commandMaxTimeout);
        commandMaxTimeout = setTimeout(() => {
          finalizeCommandCapture();
        }, 10000);
      }

      function extractAfterPrefix(text, prefix) {
        const idx = text.indexOf(prefix);
        if (idx === -1) return "";
        return text.slice(idx + prefix.length).trim();
      }

      // Apply result from /api/commands
      function isCommandTypeEnabled(type) {
        // Stop command is always enabled
        if (type === "stop") return true;
        
        // Map GPT types to toggle names
        const map = {
          timer: "Timer",
          screen: "Black screen",
          slide: "Specific Slide",
        };
        const name = map[type];
        if (!name) return false;
        try {
          return Array.isArray(commandsState)
            ? !!(commandsState.find((c) => c.name === name)?.enabled)
            : false;
        } catch {
          return false;
        }
      }

      function handleCommandResult(cmd) {
        const type = cmd?.type;
        const args = cmd?.args || null;

        if (!type || type === "none") {
          showNoCommandNotice();
          return;
        }

        // If command type disabled, treat as none with message (except stop which is always enabled)
        if (!isCommandTypeEnabled(type)) {
          showNoCommandNotice("This command is disabled");
          return; // behave like type=none
        }

        if (type === "timer") {
          const seconds = args?.seconds;
          if (typeof seconds === "number" && seconds > 0) {
            startTimerOverlay(seconds);
          }
          return;
        }

        if (type === "screen") {
          const color = typeof args?.color === "string" ? args.color : "black";
          showScreenOverlay(color);
          return;
        }

        if (type === "slide") {
          const slideNumber = args?.slideNumber;
          if (typeof slideNumber === "number" && slideNumber >= 1) {
            show(slideNumber - 1);
          }
          return;
        }

        if (type === "stop") {
          const target = (args?.target || "timer").toLowerCase();
          if (target === "timer") {
            stopTimerOverlay();
          } else if (target === "screen") {
            hideScreenOverlay();
          } else if (target === "all") {
            stopTimerOverlay();
            hideScreenOverlay();
          }
        }
      }
// COMMAND LOGIC BIG SNIPPET END

      // Read trigger words from state (no defaults)
      const nextRaw = (nextWord || "").trim();
      const prevRaw = (prevWord || "").trim();
      const stopRaw = (stopWord || "").trim();
      const queueRaw = (queueText || "").trim();

      // Parse trigger configs with metadata (only if not empty)
      const nextConfigs = nextRaw ? parseTriggerConfig(nextRaw, "next") : [];
      const prevConfigs = prevRaw ? parseTriggerConfig(prevRaw, "prev") : [];
      const stopConfigs = stopRaw ? parseTriggerConfig(stopRaw, "stop") : [];
      const queueConfigs = queueRaw ? parseTriggerConfig(queueRaw, "next") : [];

      // Helper to schedule action with delay
      function scheduleAction(action, delay) {
        if (delay === 0) {
          action();
        } else {
          const timeoutId = setTimeout(action, delay * 1000);
          pendingTimeouts.push(timeoutId);
        }
      }

      // Use project state for prefix and enabled commands
      const hasEnabledCommands = Array.isArray(commandsState)
        ? commandsState.some((c) => c.enabled)
        : false;
      const effectivePrefix = hasEnabledCommands ? (commandPrefixState || "").trim() : "";
      const commandPrefixNorm = normalize(effectivePrefix);

      // ---- PARTIALS: per-utterance counting state ----
      const perUtterance = {};
      nextConfigs.forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });
      prevConfigs.forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });
      stopConfigs.forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });
      queueConfigs.forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });
      if (commandPrefixNorm) {
        perUtterance.__prefix__ = 0;
      }

      let queueIndex = 0;
      let queuePending = false; // Prevent multiple schedules for same queue word

      // ---- WebSocket to Vosk server ----
      const WS_URL = "ws://localhost:8765"; // change to wss:// in prod
      ws = new WebSocket(WS_URL);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        try {
          // no runtime grammar; just sampleRate
          ws.send(JSON.stringify({ type: "start", sampleRate: 16000 }));
        } catch {}
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          const raw = (data.partial || data.text || "").trim();
          if (!raw) return;
          if (closed) return; // Don't process if already cleaned up

          const norm = normalize(raw);

           // --- Command prefix + logging logic ---
          const now = Date.now();

          if (commandPrefixNorm && Object.prototype.hasOwnProperty.call(perUtterance, "__prefix__")) {
            const count = countWholeWord(norm, commandPrefixNorm);

            // First time we detect the prefix in this command cycle
            if (!commandListening && count > perUtterance.__prefix__) {
              const delta = count - perUtterance.__prefix__;
              perUtterance.__prefix__ = count;

              if (delta > 0) {
                commandListening = true;
                commandStartTime = now;

                // Start the log with the full raw chunk that contained the prefix
                commandBuffer = raw;

                showListeningIndicator();
                scheduleSilenceTimeout();
                scheduleMaxTimeout();
              }
            } else if (commandListening) {
              // While listening, log EVERY chunk (partial or final) until silence/max
              if (raw) {
                if (commandBuffer) commandBuffer += " ";
                commandBuffer += raw;
              }
              scheduleSilenceTimeout();
            }

            // Max duration guard based on clock (10s)
            if (commandListening && commandStartTime && now - commandStartTime >= 10000) {
              finalizeCommandCapture();
            }
          }

          // --- Process next configs (use action from metadata)
          nextConfigs.forEach((cfg) => {
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              const delta = count - perUtterance[cfg.normalizedLabel];
              perUtterance[cfg.normalizedLabel] = count;
              for (let i = 0; i < delta; i++) {
                scheduleAction(() => {
                  if (closed) return; // Don't execute if cleaned up
                  if (cfg.action === "next") show(idx + 1);
                  else if (cfg.action === "prev") show(idx - 1);
                  else if (cfg.action === "stop") cleanup();
                }, cfg.delay);
              }
            }
          });

          // --- Process prev configs (use action from metadata)
          prevConfigs.forEach((cfg) => {
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              const delta = count - perUtterance[cfg.normalizedLabel];
              perUtterance[cfg.normalizedLabel] = count;
              for (let i = 0; i < delta; i++) {
                scheduleAction(() => {
                  if (closed) return;
                  if (cfg.action === "next") show(idx + 1);
                  else if (cfg.action === "prev") show(idx - 1);
                  else if (cfg.action === "stop") cleanup();
                }, cfg.delay);
              }
            }
          });

          // --- Process stop configs (use action from metadata)
          stopConfigs.forEach((cfg) => {
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              perUtterance[cfg.normalizedLabel] = count;
              scheduleAction(() => {
                if (closed) return;
                if (cfg.action === "stop") cleanup();
                else if (cfg.action === "next") show(idx + 1);
                else if (cfg.action === "prev") show(idx - 1);
              }, cfg.delay);
            }
          });

          // --- Queue: only the next expected word is armed, one at a time
          if (queueIndex < queueConfigs.length && !queuePending) {
            const cfg = queueConfigs[queueIndex];
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              perUtterance[cfg.normalizedLabel] = count;
              queuePending = true; // Mark as pending
              scheduleAction(() => {
                if (closed) return;
                // Execute action based on metadata
                if (cfg.action === "next") show(idx + 1);
                else if (cfg.action === "prev") show(idx - 1);
                else if (cfg.action === "stop") cleanup();
                // Advance to next queue entry
                queueIndex++;
                queuePending = false; // Ready for next word
              }, cfg.delay);
            }
          }

          // On final, reset per-utterance counts (queueIndex persists)
          if (data.text) {
            Object.keys(perUtterance).forEach((key) => {
              perUtterance[key] = 0;
            });
          }
        } catch {}
      };

      // Mic capture -> downsample to 16k -> PCM16 -> ws.send
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
        },
        video: false,
      });

      ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
      const ctxSampleRate = ctx.sampleRate; // <— capture once

      src = ctx.createMediaStreamSource(stream);
      proc = ctx.createScriptProcessor(4096, 1, 1);

      function floatTo16(f32) {
        const out = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
          let s = Math.max(-1, Math.min(1, f32[i]));
          out[i] = s < 0 ? s * 32768 : s * 32767;
        }
        return out;
      }
      function downsampleTo16k(input, inRate) {
        if (inRate === 16000) return floatTo16(input);
        const ratio = inRate / 16000;
        const outLen = Math.floor(input.length / ratio);
        const out = new Float32Array(outLen);
        let i = 0,
          o = 0;
        while (o < outLen) {
          const i0 = Math.floor(i),
            i1 = Math.min(i0 + 1, input.length - 1);
          const frac = i - i0;
          out[o++] = input[i0] * (1 - frac) + input[i1] * frac;
          i += ratio;
        }
        return floatTo16(out);
      }

    proc.onaudioprocess = (e) => {
      if (!proc || !ctx || !ws || ws.readyState !== WebSocket.OPEN) return; // <— guards
      const f32 = e.inputBuffer.getChannelData(0);
      const pcm16 = downsampleTo16k(f32, ctxSampleRate); // <— use captured value
      ws.send(pcm16.buffer);
    };

      // keep graph alive but muted
      gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(proc);
      proc.connect(gain);
      gain.connect(ctx.destination);

      // ---- keyboard + fullscreen handlers (restored) ----
      function cleanup() {
        if (closed) return;
        closed = true;
       resetCommandCapture();
        stopTimerOverlay();
        hideScreenOverlay();

        // Cancel all pending delayed actions
        pendingTimeouts.forEach(id => clearTimeout(id));
        pendingTimeouts = [];

        // stop DOM listeners first
        try { document.removeEventListener("keydown", onKey, true); } catch {}
        try { document.removeEventListener("fullscreenchange", onFsChange, true); } catch {}

        // stop audio graph (prevent one last callback)
        try { if (proc) proc.onaudioprocess = null; } catch {}
        try { if (proc) proc.disconnect(); } catch {}
        try { if (src) src.disconnect(); } catch {}
        try { if (gain) gain.disconnect(); } catch {}
        try { if (stream) stream.getTracks().forEach(t => t.stop()); } catch {}
        try { if (ctx && ctx.state !== "closed") ctx.close(); } catch {}
        proc = null; src = null; gain = null; stream = null; ctx = null;

        // close websocket with a normal close code
        try {
          if (ws) {
            // detach handlers so we don't log noise during shutdown
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null;

            if (ws.readyState === WebSocket.OPEN) {
              try { ws.send(JSON.stringify({ type: "stop" })); } catch {}
              ws.close(1000, "client done"); // normal closure
            } else {
              ws.close(1000, "client done");
            }
          }
        } catch {}
        ws = null;

        // exit fullscreen & remove overlay
        try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(()=>{}); } catch {}
        try { const el = document.getElementById("pptx-viewer-root"); if (el) el.remove(); } catch {}

        try {
          if (noCommandNoticeTimeout) clearTimeout(noCommandNoticeTimeout);
          if (noCommandNoticeEl && noCommandNoticeEl.parentNode) {
            noCommandNoticeEl.parentNode.removeChild(noCommandNoticeEl);
          }
        } catch {}
        noCommandNoticeEl = null;
        noCommandNoticeTimeout = null;
      }


      function onKey(e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          show(idx + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          show(idx - 1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          cleanup();
        }
      }

      function onFsChange() {
        if (!document.fullscreenElement) cleanup();
      }

      document.documentElement.requestFullscreen?.().catch(() => {});
      document.addEventListener("keydown", onKey, true);
      document.addEventListener("fullscreenchange", onFsChange, true);
    } catch (e) {
      console.error(e);
      setError("Failed to render PPTX or start voice control.");
    } finally {
      setIsBusy(false);
    }
  }

const [showAdvanced, setShowAdvanced] = useState(false);
const [nextWord, setNextWord] = useState("");
const [prevWord, setPrevWord] = useState("");
const [queueText, setQueueText] = useState("");
const [stopWord, setStopWord] = useState("");
const [advancedEnabled, setAdvancedEnabled] = useState(false);
// Commands persistence state
const [commandPrefixState, setCommandPrefixState] = useState("");
const [commandsState, setCommandsState] = useState([
  { id: 1, name: "Black screen", description: "Shows a black (or other color) screen.", enabled: false },
  { id: 2, name: "Timer", description: "Starts a countdown timer.", enabled: false },
  { id: 3, name: "Specific Slide", description: "Goes to a specific slide of preference.", enabled: false },
]);
const [isDirty, setIsDirty] = useState(false);
const saveTimeoutRef = useRef(null);
const [nextWordError, setNextWordError] = useState(false);
const [prevWordError, setPrevWordError] = useState(false);
const [stopWordError, setStopWordError] = useState(false);

  // Validate single trigger field (next/prev/stop)
  function validateSingleTrigger(text) {
    if (!text.trim()) return true; // Empty is valid
    const tokens = text.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
    
    // Check if more than one word
    if (tokens.length > 1) return false;
    
    // Check format if has metadata
    const token = tokens[0];
    if (token.includes('(')) {
      const match = token.match(/^(.+?)\((next|prev|stop):(\d+)\)$/);
      if (!match) return false; // Invalid format or action
    }
    return true;
  }

  // Parse trigger config: "word(action:delay)" or plain "word"
  function parseTriggerConfig(rawText, defaultAction) {
    const tokens = rawText
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return tokens.map((token) => {
      const match = token.match(/^(.+?)\((\w+):(\d+)\)$/);
      if (match) {
        const [, label, action, delayStr] = match;
        return {
          label: label.trim(),
          normalizedLabel: normalize(label.trim()),
          action: action === "previous" ? "prev" : action,
          delay: parseInt(delayStr, 10) || 0,
        };
      }
      // No brackets, use defaults
      return {
        label: token,
        normalizedLabel: normalize(token),
        action: defaultAction,
        delay: 0,
      };
    });
  }

  // Wrap plain words with metadata: word → word(action:delay)
  function wrapWithMetadata(rawText, defaultAction) {
    const tokens = rawText
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return tokens
      .map((token) => {
        // If already has metadata, keep it
        if (/\(.+:.+\)$/.test(token)) return token;
        // Otherwise add default
        return `${token}(${defaultAction}:0)`;
      })
      .join(", ");
  }

  // Strip metadata: word(action:delay) → word
  function stripMetadata(rawText) {
    return rawText
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((token) => token.replace(/\(.+:.+\)$/, ""))
      .join(", ");
  }

  // Toggle advanced mode
  function handleAdvancedToggle(checked) {
    setShowAdvanced(checked);
    setAdvancedEnabled(checked);
    setIsDirty(true);
    if (checked) {
      // Wrap plain words with metadata
      setNextWord((prev) => wrapWithMetadata(prev, "next"));
      setPrevWord((prev) => wrapWithMetadata(prev, "prev"));
      setStopWord((prev) => wrapWithMetadata(prev, "stop"));
      setQueueText((prev) => wrapWithMetadata(prev, "next"));
    } else {
      // Strip metadata
      setNextWord((prev) => stripMetadata(prev));
      setPrevWord((prev) => stripMetadata(prev));
      setStopWord((prev) => stripMetadata(prev));
      setQueueText((prev) => stripMetadata(prev));
    }
  }

// Load project data when projectId changes
// (Make sure PresentationControlsProject receives projectId as a prop)

useEffect(() => {
  if (!projectId) return;

  let cancelled = false;
  setIsDirty(false); // 👈 new: reset when opening/switching project

  async function loadProjectControls() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (cancelled) return;

      setNextWord(data.nextTrigger || "");
      setPrevWord(data.prevTrigger || "");
      setQueueText((data.queue || []).join(", "));
      setAdvancedEnabled(!!data.advancedEnabled);
      setShowAdvanced(!!data.advancedEnabled);
      setStopWord(data.stopTrigger || "");          // 👈 new
      // Commands persistence
      setCommandPrefixState(data.commandPrefix || "");
      // Normalize commands shape or fallback to defaults
      const loadedCommands = Array.isArray(data.commands) && data.commands.length
        ? data.commands.map((c, i) => ({
            id: typeof c.id === "number" ? c.id : i + 1,
            name: c.name,
            description: c.description ?? (c.name === "Timer" ? "Starts a countdown timer." : c.name === "Black screen" ? "Shows a black (or other color) screen." : "Goes to a specific slide of preference."),
            enabled: !!c.enabled,
          }))
        : [
            { id: 1, name: "Black screen", description: "Shows a black (or other color) screen.", enabled: false },
            { id: 2, name: "Timer", description: "Starts a countdown timer.", enabled: false },
            { id: 3, name: "Specific Slide", description: "Goes to a specific slide of preference.", enabled: false },
          ];
      setCommandsState(loadedCommands);
    } catch (e) {
      console.error("Failed to load project controls:", e);
    }
  }

  loadProjectControls();
  return () => {
    cancelled = true;
  };
}, [projectId]);

// Autosave when fields change (debounced)
useEffect(() => {
  if (!projectId) return;
  if (!isDirty) return; // 👈 only autosave when user changed something

  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }

  saveTimeoutRef.current = setTimeout(async () => {
    try {
      const queueArray = queueText
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextTrigger: nextWord,
          prevTrigger: prevWord,
          queue: queueArray,
          advancedEnabled,
          stopTrigger: stopWord, // 👈 new
          commandPrefix: commandPrefixState,
          commands: commandsState,
        }),
      });
    } catch (e) {
      console.error("Failed to autosave project controls:", e);
    }
  }, 800);

  return () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };
}, [projectId, nextWord, prevWord, queueText, advancedEnabled, stopWord, commandPrefixState, commandsState, isDirty]);

  
  return (
    <div
      className="w-full h-full rounded-2xl border border-white/10 flex flex-col min-h-0"
      style={{
        background: "linear-gradient(135deg, #28335080 0%, #32416A80 100%)",
        padding: "24px 28px",
        boxShadow: "0 18px 45px #2B74700D",
      }}
    >
      {/* Header */}
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
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-white font-semibold text-[20px]">
            Presentation Controls:{projectName ? `  ${projectName}` : ""}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col gap-6 min-h-0">
        {/* Basic Trigger Words (Vertical) */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Next slide
            </label>
            <input
              type="text"
              placeholder="Next"
              value={nextWord}
              onChange={(e) => {
                setIsDirty(true);
                setNextWord(e.target.value);
                setNextWordError(false);
              }}
              onBlur={(e) => setNextWordError(!validateSingleTrigger(e.target.value))}
              className="w-full px-3 py-2 border border-white/12 rounded-md bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300/70"
              style={nextWordError ? {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(239, 68, 68, 0.3) 2px, rgba(239, 68, 68, 0.3) 4px)',
                backgroundSize: '6px 2px',
                backgroundPosition: '0 100%',
                backgroundRepeat: 'repeat-x'
              } : {}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Previous slide
            </label>
            <input
              type="text"
              placeholder="Prev"
              value={prevWord}
              onChange={(e) => {
                setIsDirty(true);
                setPrevWord(e.target.value);
                setPrevWordError(false);
              }}
              onBlur={(e) => setPrevWordError(!validateSingleTrigger(e.target.value))}
              className="w-full px-3 py-2 border border-white/12 rounded-md bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300/70"
              style={prevWordError ? {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(239, 68, 68, 0.3) 2px, rgba(239, 68, 68, 0.3) 4px)',
                backgroundSize: '6px 2px',
                backgroundPosition: '0 100%',
                backgroundRepeat: 'repeat-x'
              } : {}}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Stop presentation
            </label>
            <input
              type="text"
              placeholder="Stop"
              value={stopWord}
              onChange={(e) => {
                setIsDirty(true);
                setStopWord(e.target.value);
                setStopWordError(false);
              }}
              onBlur={(e) => setStopWordError(!validateSingleTrigger(e.target.value))}
              className="w-full px-3 py-2 border border-white/12 rounded-md bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300/70"
              style={stopWordError ? {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(239, 68, 68, 0.3) 2px, rgba(239, 68, 68, 0.3) 4px)',
                backgroundSize: '6px 2px',
                backgroundPosition: '0 100%',
                backgroundRepeat: 'repeat-x'
              } : {}}
            />
          </div>
        </div>

        {/* Your Queue */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Your Queue
          </label>
          <textarea
            placeholder="Add words to queue (each word separated by space or comma)"
            rows={3}
            value={queueText}
            onChange={(e) => {
              setIsDirty(true); // 👈 user edited
              setQueueText(e.target.value);
            }}
            className="w-full px-3 py-2 border border-white/12 rounded-md bg-white/5 text-white text-sm
focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300/70"
          />
        </div>

        {/* Advanced Options Checkbox */}
        <div className="flex items-center gap-2">
          <input
            id="advanced-options"
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => handleAdvancedToggle(e.target.checked)}
            className="w-4 h-4 bg-white/5 border borderfocus:ring-2-white/12 rounded  focus:ring-[#3FA29E]/0 accent-[#4264d6]"
          />
          <label
            htmlFor="advanced-options"
            className="text-sm text-white/75 cursor-pointer select-none"
          >
            Advanced options
          </label>
          <div className="relative group">
            <svg 
              className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors cursor-help" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
              <div className="text-xs font-semibold text-white mb-1">Add delays and specific actions</div>
              <div className="text-xs text-white/70 leading-relaxed">
                Enable to customize each trigger word with format: <span className="text-blue-300 font-mono">word(action:delay)</span>. 
                Example: <span className="text-blue-300 font-mono">word(next:3)</span> advances after 3 seconds. <span className="text-blue-300 font-mono">word(prev:2)</span> returns after 2 seconds.<span className="text-blue-300 font-mono"> word(stop:5)</span> closes powerpoint after 5 seconds.
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Embedded Commands */}
        <div>
          <Commands
            prefix={commandPrefixState}
            onPrefixChange={(v) => {
              setCommandPrefixState(v);
              setIsDirty(true);
            }}
            commands={commandsState}
            onCommandsChange={(list) => {
              setCommandsState(list);
              setIsDirty(true);
            }}
          />
        </div>

        {/* Upload and Start Buttons */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-3">
            <input
              id="ppt-upload"
              type="file"
              accept=".ppt,.pptx"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f ? f.name : "");
              }}
            />
            <label
              htmlFor="ppt-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/12 rounded-md text-sm font-medium text-white shadow-sm hover:bg-white/10 cursor-pointer transition-colors"
            >
              Upload .pptx
            </label>

            {fileName ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-sm text-white shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      if (fileInputRef.current)
                        fileInputRef.current.value = "";
                    } catch {}
                    setFileName("");
                  }}
                  className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer transition-colors"
                  aria-label="Remove file"
                  title="Remove file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <span className="truncate max-w-[12ch]" title={fileName}>
                  {fileName}
                </span>
              </div>
            ) : (
              <span className="text-sm text-white/60">No file selected</span>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={isBusy}
            className="flex-1 inline-flex items-center justify-center px-6 py-2.5 bg-linear-to-r from-[#4A6FE5] to-[#3956C4] text-white font-semibold rounded-lg shadow-md hover:opacity-95 disabled:opacity-60 transition-opacity"
          >
            {isBusy ? "Loading…" : "Start Presentation"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
