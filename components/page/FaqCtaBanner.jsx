"use client";

import { useRef, useState } from "react";

export default function FaqCtaBanner() {
  const fileInputRef = useRef(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);

  // --- Overlay for fullscreen PPT viewer (same idea as PresentationControls) ---
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

  // Load pptx-preview UMD bundle
  function loadPptxPreviewUMD() {
    return new Promise((resolve, reject) => {
      if (window.pptxPreview) return resolve(window.pptxPreview);
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/pptx-preview@1.0.7/dist/pptx-preview.umd.js";
      s.onload = () => resolve(window.pptxPreview);
      s.onerror = () => reject(new Error("Failed to load pptx-preview"));
      document.head.appendChild(s);
    });
  }

  // --- Helpers copied from PresentationControls.js :contentReference[oaicite:1]{index=1} ---
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

    try {
      const file = input.files[0];
      const buf = await file.arrayBuffer();

      const pptxPreview = await loadPptxPreviewUMD();
      const overlay = ensureOverlay();
      overlay.innerHTML = "";
      overlay.focus();

      // Render slides
      const viewer = pptxPreview.init(overlay, {
        width: 1920,
        height: 1080,
      });
      await viewer.preview(buf);

      // Find slide elements
      const container =
        overlay.querySelector(
          ".pptx-viewer, .pptx-preview, .pptx-container"
        ) ||
        overlay.firstElementChild ||
        overlay;

      let slides = Array.from(
        container.querySelectorAll(
          ".pptx-slide, .pptx-preview__slide, .slide, section"
        )
      );
      if (!slides.length) slides = Array.from(container.children);
      slides = slides.filter(
        (el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE"
      );
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

      // --- Static trigger words: "next" and "back" ---
      const nextConfigs = [
        {
          label: "next",
          normalizedLabel: normalize("next"),
          action: "next",
          delay: 0,
        },
      ];
      const prevConfigs = [
        {
          label: "back",
          normalizedLabel: normalize("back"),
          action: "prev",
          delay: 0,
        },
      ];

      function scheduleAction(action, delay) {
        if (delay === 0) {
          action();
        } else {
          const timeoutId = setTimeout(action, delay * 1000);
          pendingTimeouts.push(timeoutId);
        }
      }

      // per-utterance counting (same logic pattern)
      const perUtterance = {};
      [...nextConfigs, ...prevConfigs].forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });

      // --- WebSocket to Vosk ASR server ---
      const WS_URL = "ws://localhost:8765"; // change to wss:// in prod
      ws = new WebSocket(WS_URL);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        try {
          ws.send(JSON.stringify({ type: "start", sampleRate: 16000 }));
        } catch {}
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          const raw = (data.partial || data.text || "").trim();
          if (!raw) return;
          if (closed) return;

          const norm = normalize(raw);

          // NEXT
          nextConfigs.forEach((cfg) => {
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              const delta = count - perUtterance[cfg.normalizedLabel];
              perUtterance[cfg.normalizedLabel] = count;
              for (let i = 0; i < delta; i++) {
                scheduleAction(() => {
                  if (closed) return;
                  show(idx + 1);
                }, cfg.delay);
              }
            }
          });

          // PREV (back)
          prevConfigs.forEach((cfg) => {
            const count = countWholeWord(norm, cfg.normalizedLabel);
            if (count > perUtterance[cfg.normalizedLabel]) {
              const delta = count - perUtterance[cfg.normalizedLabel];
              perUtterance[cfg.normalizedLabel] = count;
              for (let i = 0; i < delta; i++) {
                scheduleAction(() => {
                  if (closed) return;
                  show(idx - 1);
                }, cfg.delay);
              }
            }
          });

          // On final result, reset per-utterance counters
          if (data.text) {
            Object.keys(perUtterance).forEach((key) => {
              perUtterance[key] = 0;
            });
          }
        } catch {
          // ignore parse errors
        }
      };

      // --- Microphone → AudioContext → 16k PCM16 → WebSocket (same as PresentationControls) ---
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
        },
        video: false,
      });

      ctx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 48000,
      });
      const ctxSampleRate = ctx.sampleRate;

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
          const i0 = Math.floor(i);
          const i1 = Math.min(i0 + 1, input.length - 1);
          const frac = i - i0;
          out[o++] = input[i0] * (1 - frac) + input[i1] * frac;
          i += ratio;
        }
        return floatTo16(out);
      }

      proc.onaudioprocess = (e) => {
        if (!proc || !ctx || !ws || ws.readyState !== WebSocket.OPEN) return;
        const f32 = e.inputBuffer.getChannelData(0);
        const pcm16 = downsampleTo16k(f32, ctxSampleRate);
        ws.send(pcm16.buffer);
      };

      // keep graph alive but muted
      gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(proc);
      proc.connect(gain);
      gain.connect(ctx.destination);

      // --- Cleanup / keyboard / fullscreen handlers (same pattern) ---
      function cleanup() {
        if (closed) return;
        closed = true;

        // cancel any delayed actions
        pendingTimeouts.forEach((id) => clearTimeout(id));
        pendingTimeouts = [];

        try {
          document.removeEventListener("keydown", onKey, true);
        } catch {}
        try {
          document.removeEventListener("fullscreenchange", onFsChange, true);
        } catch {}

        try {
          if (proc) proc.onaudioprocess = null;
        } catch {}
        try {
          if (proc) proc.disconnect();
        } catch {}
        try {
          if (src) src.disconnect();
        } catch {}
        try {
          if (gain) gain.disconnect();
        } catch {}
        try {
          if (stream) stream.getTracks().forEach((t) => t.stop());
        } catch {}
        try {
          if (ctx && ctx.state !== "closed") ctx.close();
        } catch {}

        proc = null;
        src = null;
        gain = null;
        stream = null;
        ctx = null;

        try {
          if (ws) {
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null;

            if (ws.readyState === WebSocket.OPEN) {
              try {
                ws.send(JSON.stringify({ type: "stop" }));
              } catch {}
              ws.close(1000, "client done");
            } else {
              ws.close(1000, "client done");
            }
          }
        } catch {}
        ws = null;

        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {}

        try {
          const el = document.getElementById("pptx-viewer-root");
          if (el) el.remove();
        } catch {}
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

  return (
    <section className="px-0 md:px-4 pt-8 md:pt-12 md:-mb-8 w-full 2xl:max-w-360">
      <div className="mx-auto px-0 md:px-12">
        <div
          className="rounded-[40px] md:rounded-[56px] p-6 py-10 md:py-16 md:p-16 text-center shadow-lg
            bg-linear-to-br from-[#53C1BC] via-[#3FA29E] to-[#2B7470]"
        >
          <h3 className="text-white font-semibold tracking-tight leading-tight text-2xl md:text-5xl lg:text-5xl">
            Try out our software
            for free!
          </h3>

          <p className="mt-4 text-sm md:text-xl leading-relaxed text-white">
            Say <strong>“next”</strong> or <strong>“back”</strong> to control your
            presentation. You can also use the arrow keys and Escape.
          </p>

          {/* Upload + start controls */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ppt,.pptx"
                className="hidden"
                id="faq-cta-ppt-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    setIsUploaded(true);
                    setError(null);
                  } else {
                    setFileName("");
                    setIsUploaded(false);
                  }
                }}
              />
              <label
                htmlFor="faq-cta-ppt-upload"
                className="inline-flex items-center justify-center
                  rounded-2xl border-2 border-white/90 bg-white/0
                  px-6 md:px-6 py-3.5 md:py-4
                  text-base md:text-lg font-medium text-white
                  hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80
                  cursor-pointer transition-all"
              >
                {fileName ? "Change PowerPoint" : "Upload PowerPoint"}
                <span className="ml-2">&gt;</span>
              </label>
            </div>

            {fileName && (
              <>
                <p className="text-sm text-white/90 truncate max-w-xs mx-auto">
                  Selected: <span className="font-semibold">{fileName}</span>
                </p>
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={isBusy}
                  className="inline-flex items-center justify-center
                    rounded-2xl border-2 border-white/90 bg-white
                    px-6 md:px-8 py-3.5 md:py-4
                    text-base md:text-lg font-semibold text-[#2B7470]
                    hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/80
                    disabled:opacity-70 transition-all"
                >
                  {isBusy ? "Loading…" : "Start Presentation"}
                </button>
              </>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-100 bg-red-500/20 px-3 py-1 rounded-full">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
