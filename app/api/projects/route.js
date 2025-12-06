// app/api/projects/route.js
import clientPromise from "@/libs/mongo";
import { auth } from "@/auth";

/**
 * GET /api/projects
 * Returns all projects for the current user
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const projects = await db
    .collection("projects")
    .find({ userId: session.user.id }) // we store userId as a string
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(projects);
}

/**
 * POST /api/projects
 * Creates a new project for the current user
 * Body example:
 * {
 *   "name": "Project 1",
 *   "nextTrigger": "next",
 *   "prevTrigger": "previous",
 *   "queue": ["intro", "demo"],
 *   "advancedEnabled": false,
 *   "pptxUrl": null
 * }
 */
export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const now = new Date();

  const projectDoc = {
    userId: session.user.id,
    name: body.name || "Untitled project",
    createdAt: now,
    updatedAt: now,

    // voice control fields
    nextTrigger: body.nextTrigger || "",
    prevTrigger: body.prevTrigger || "",
    // fixed key name
    stopTrigger: body.stopTrigger || "",
    queue: body.queue || [], // array of strings
    advancedEnabled: !!body.advancedEnabled,

    // commands persistence
    commandPrefix: body.commandPrefix || "",
    commands: Array.isArray(body.commands) && body.commands.length
      ? body.commands
      : [
          { id: 1, name: "Black screen", description: "Shows a black (or other color) screen.", enabled: false },
          { id: 2, name: "Timer", description: "Starts a countdown timer.", enabled: false },
          { id: 3, name: "Specific Slide", description: "Goes to a specific slide of preference.", enabled: false },
        ],

    // file reference (URL or path, not the raw file)
    pptxUrl: body.pptxUrl || null,
  };

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("projects").insertOne(projectDoc);

  return Response.json(
    { ...projectDoc, _id: result.insertedId },
    { status: 201 }
  );
}
