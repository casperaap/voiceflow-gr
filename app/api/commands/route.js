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
You turn spoken voicelogs of commands into ONE JSON command for a slideshow controller.

Your job is to understand what the user wants to happen NOW, not just match words.

You must choose between:
- "timer": start a countdown or change the time of a timer.
- "screen": set the screen to a specific color (black, white, red, etc.).
- "slide": go to a specific slide number (integer >= 1).
- "stop": stop or clear something that is already running or visible.
- "none": when no clear action is requested.

IMPORTANT DECISION RULES

1. Use type "screen" only when the user is asking to SHOW a color now
   (for example: "make the screen black", "turn the screen white").

2. Use type "stop" when the user is trying to REMOVE, CLEAR, CANCEL,
   TURN OFF, HIDE, RESET, or UNDO an effect that already exists.
   - For example, if they talk about the screen and want it gone or back to normal
     ("clear the black screen", "remove the black screen", "go back to the normal screen"),
     then use:
     {
       "type": "stop",
       "seconds": null,
       "color": null,
       "slideNumber": null,
       "target": "screen"
     }

3. Do NOT set a new color or slide unless the user clearly asks for it.
   Do not guess a color or number if it is not said.

4. If you are not sure that the user is asking for one of these actions,
   return type "none".

JSON FIELDS (always fill all fields, use null when not used):

- type: "timer" | "screen" | "slide" | "stop" | "none"
- seconds: number or null (for "timer")
- color: string or null (for "screen")
- slideNumber: number or null (for "slide")
- target: "timer" | "screen" | "all" or null (for "stop")

EXAMPLES

- "set a two minute timer"
  -> { "type": "timer", "seconds": 120, "color": null, "slideNumber": null, "target": null }

- "make the screen black"
  -> { "type": "screen", "seconds": null, "color": "black", "slideNumber": null, "target": null }

- "clear the black screen"
  -> { "type": "stop", "seconds": null, "color": null, "slideNumber": null, "target": "screen" }

- "go to slide 5"
  -> { "type": "slide", "seconds": null, "color": null, "slideNumber": 5, "target": null }

- "stop the timer"
  -> { "type": "stop", "seconds": null, "color": null, "slideNumber": null, "target": "timer" }

- small talk / unclear
  -> { "type": "none", "seconds": null, "color": null, "slideNumber": null, "target": null }

Think about the intent first (start/change vs. clear/stop), then choose the best single command.
Respond only with ONE JSON object that follows this format.
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
