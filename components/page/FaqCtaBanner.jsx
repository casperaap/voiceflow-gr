"use client";

import { useRef, useState } from "react";

const MODEL_URL =
  "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz";

export default function FaqCtaBanner() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const modelRef = useRef(null);
  const voskModuleRef = useRef(null);

  // --- Overlay for fullscreen PPT viewer ---
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

  // --- Normalization helpers (same as before) ---
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

  // --- Load Vosk model (vosk-browser) ---
  async function loadVoiceModel() {
    if (modelRef.current) return modelRef.current;

    const Vosk =
      voskModuleRef.current || (voskModuleRef.current = await import("vosk-browser"));

    // NPM API: createModel(url) -> Model :contentReference[oaicite:1]{index=1}
    const model = await Vosk.createModel(MODEL_URL);
    modelRef.current = model;
    return model;
  }

  async function handleLoadModelClick() {
    setError(null);
    setIsBusy(true);
    try {
      const model = await loadVoiceModel();
      if (!model) throw new Error("Model did not load");
      console.log("[VOSK] Model loaded", MODEL_URL);
      setModelLoaded(true);
    } catch (e) {
      console.error(e);
      setError("Failed to load voice model.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleStart() {
    setError(null);

    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please upload a .pptx first.");
      return;
    }

    if (!modelRef.current) {
      setError('Voice model is not loaded yet. Click "Load voice model" first.');
      return;
    }

    const model = modelRef.current;

    setIsBusy(true);

    let stream = null,
      ctx = null,
      src = null,
      proc = null,
      gain = null,
      recognizer = null;
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

      // --- Trigger words: "next" and "back" ---
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

      const perUtterance = {};
      [...nextConfigs, ...prevConfigs].forEach((cfg) => {
        perUtterance[cfg.normalizedLabel] = 0;
      });

      function handleRecognizerMessage(message, isFinal) {
        try {
          const raw =
            (isFinal
              ? message.result?.text || ""
              : message.result?.partial || "") || "";
          const trimmed = raw.trim();
          if (!trimmed || closed) return;

          console.log(
            "[VOSK]",
            isFinal ? "Result:" : "Partial:",
            trimmed
          );

          const norm = normalize(trimmed);

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

          // Reset counters at end of utterance
          if (isFinal) {
            Object.keys(perUtterance).forEach((key) => {
              perUtterance[key] = 0;
            });
          }
        } catch (err) {
          console.error("Error handling recognizer message", err);
        }
      }

      // --- Microphone → AudioContext → recognizer (Vosk in-browser) ---

      // 1. Get mic
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
        },
        video: false,
      });

      // 2. AudioContext
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      await ctx.resume();
      const recognizerSampleRate = ctx.sampleRate;
      console.log("[VOSK] AudioContext sampleRate:", recognizerSampleRate);

      // 3. Recognizer with correct sampleRate (REQUIRED) :contentReference[oaicite:2]{index=2}
      recognizer = new model.KaldiRecognizer(recognizerSampleRate);
      // Optional: output word-level info if you ever need it
      recognizer.setWords?.(true);

      recognizer.on("result", (message) =>
        handleRecognizerMessage(message, true)
      );
      recognizer.on("partialresult", (message) =>
        handleRecognizerMessage(message, false)
      );

      src = ctx.createMediaStreamSource(stream);
      proc = ctx.createScriptProcessor(4096, 1, 1);

      proc.onaudioprocess = (e) => {
        if (!proc || !ctx || !recognizer || closed) return;
        try {
          // Feed raw AudioBuffer directly; vosk-browser will read samples from it
          recognizer.acceptWaveform(e.inputBuffer);
        } catch (error) {
          console.error("acceptWaveform failed", error);
        }
      };

      // Keep graph alive but muted
      gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(proc);
      proc.connect(gain);
      gain.connect(ctx.destination);

      // --- Cleanup / keyboard / fullscreen handlers ---
      function cleanup() {
        if (closed) return;
        closed = true;

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
          if (recognizer) recognizer.remove();
        } catch {}
        recognizer = null;

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

  async function handlePrimaryClick() {
    setError(null);

    if (!fileName) {
      const input = fileInputRef.current;
      if (input) input.click();
      return;
    }

    if (!modelLoaded) {
      await handleLoadModelClick();
      return;
    }

    await handleStart();
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

          <div className="mt-8 flex flex-col items-center gap-4">
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
                  setError(null);
                } else {
                  setFileName("");
                }
              }}
            />

            <button
              type="button"
              onClick={handlePrimaryClick}
              disabled={isBusy}
              className="inline-flex items-center justify-center
                rounded-2xl border-2 border-white/90 bg-white
                px-6 md:px-8 py-3.5 md:py-4
                text-base md:text-lg font-semibold text-[#2B7470]
                hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/80
                disabled:opacity-70 transition-all"
            >
              {isBusy
                ? !fileName
                  ? "Working…"
                  : !modelLoaded
                  ? "Loading voice model…"
                  : "Starting…"
                : !fileName
                ? "Upload file"
                : !modelLoaded
                ? "Load voice model"
                : "Start presentation"}
            </button>

            {fileName && (
              <p className="text-sm text-white/90 truncate max-w-xs mx-auto">
                Selected: <span className="font-semibold">{fileName}</span>
              </p>
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
