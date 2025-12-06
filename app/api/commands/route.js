// app/api/commands/route.js

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Single object schema (no unions, no optional fields)
const CommandSchema = z.object({
  type: z.enum(["timer", "screen", "slide", "stop", "none"]),
  // timer
  seconds: z.number().nullable(),
  // screen
  color: z.string().nullable(),
  // slide
  slideNumber: z.number().nullable(),
  // stop
  target: z.enum(["timer", "screen", "all"]).nullable(),
});

const SYSTEM_PROMPT = `
You are a command parser for a voice-controlled slideshow.

Given all the logs transcript of our speech to text model, map it to ONE of these types:
- timer: start a countdown (convert any duration to seconds).
- screen: change the screen color (e.g. "black", "white").
- slide: go to a specific slide number (integer >= 1).
- stop: stop a feature ("timer", "screen", or "all").
- none: when no valid command is clearly requested.

Schema fields:
- type: "timer" | "screen" | "slide" | "stop" | "none"
- seconds: number or null (for "timer")
- color: string or null (for "screen")
- slideNumber: number or null (for "slide")
- target: "timer" | "screen" | "all" or null (for "stop")

Examples:
- "set a two minute timer" -> { "type": "timer", "seconds": 120, "color": null, "slideNumber": null, "target": null }
- "make the screen black" -> { "type": "screen", "seconds": null, "color": "black", "slideNumber": null, "target": null }
- "go to slide 5" -> { "type": "slide", "seconds": null, "color": null, "slideNumber": 5, "target": null }
- "stop the timer" -> { "type": "stop", "seconds": null, "color": null, "slideNumber": null, "target": "timer" }
- small talk / unclear -> { "type": "none", "seconds": null, "color": null, "slideNumber": null, "target": null }

Respond only via this JSON schema; no extra text.

Don't create bias to these specific examples. Understand what the user says and map to the best fitting command.
`.trim();

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' in request body" },
        { status: 400 }
      );
    }

    const { text } = body;

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4.1-mini", // cheap model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      response_format: zodResponseFormat(CommandSchema, "command"),
    });

    const parsed = completion.choices[0]?.message?.parsed;

    const safe = normalizeCommand(parsed);

    return NextResponse.json(safe);
  } catch (err) {
    console.error("Error in /api/commands:", err);
    return NextResponse.json(
      {
        type: "none",
        args: null,
        error: "internal_error",
      },
      { status: 500 }
    );
  }
}

function normalizeCommand(obj) {
  const baseNone = { type: "none", args: null };

  if (!obj || typeof obj !== "object") return baseNone;

  const type = obj.type;

  if (type === "none") {
    return baseNone;
  }

  if (type === "timer") {
    const seconds = toPositiveInt(obj.seconds);
    if (!seconds) return baseNone;
    return {
      type: "timer",
      args: { seconds },
    };
  }

  if (type === "screen") {
    const color =
      typeof obj.color === "string" && obj.color.trim()
        ? obj.color.trim().toLowerCase()
        : null;
    if (!color) return baseNone;
    return {
      type: "screen",
      args: { color },
    };
  }

  if (type === "slide") {
    const slideNumber = toPositiveInt(obj.slideNumber);
    if (!slideNumber) return baseNone;
    return {
      type: "slide",
      args: { slideNumber },
    };
  }

  if (type === "stop") {
    const raw = obj.target || "timer";
    const target = String(raw).toLowerCase();
    let normalized = "timer";
    if (target.includes("screen")) normalized = "screen";
    else if (target.includes("all")) normalized = "all";

    return {
      type: "stop",
      args: { target: normalized },
    };
  }

  return baseNone;
}

function toPositiveInt(value) {
  if (value == null) return null;
  const n =
    typeof value === "number" ? value : parseInt(String(value), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}
