// app/api/projects/[id]/route.js
import clientPromise from "@/libs/mongo";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";

async function getDbAndUser() {
  const session = await auth();
  if (!session?.user) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  const client = await clientPromise;
  const db = client.db();

  return { db, userId: session.user.id };
}

// GET /api/projects/:id
export async function GET(request, { params }) {
  const { id } = await params; // Next wants params awaited
  const { db, userId, error } = await getDbAndUser();
  if (error) return error;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return new Response("Invalid id", { status: 400 });
  }

  const project = await db.collection("projects").findOne({
    _id: objectId,
  });

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  // Make sure this project belongs to the logged in user
  if (String(project.userId) !== String(userId)) {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json({
    ...project,
    _id: project._id.toString(),
  });
}

// PATCH /api/projects/:id  (rename / autosave)
export async function PATCH(request, { params }) {
  const { id } = await params;
  const { db, userId, error } = await getDbAndUser();
  if (error) return error;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return new Response("Invalid id", { status: 400 });
  }

  const existing = await db.collection("projects").findOne({
    _id: objectId,
  });

  if (!existing) {
    return new Response("Not found", { status: 404 });
  }

  // Check ownership
  if (String(existing.userId) !== String(userId)) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await request.json();

  await db.collection("projects").updateOne(
    { _id: objectId },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    }
  );

  // Return the merged project (old + new fields) without touching result.value
  return Response.json({
    ...existing,
    ...data,
    _id: id,
  });
}

// DELETE /api/projects/:id
export async function DELETE(request, { params }) {
  const { id } = await params;
  const { db, userId, error } = await getDbAndUser();
  if (error) return error;

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return new Response("Invalid id", { status: 400 });
  }

  const project = await db.collection("projects").findOne({
    _id: objectId,
  });

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  // Check ownership
  if (String(project.userId) !== String(userId)) {
    return new Response("Forbidden", { status: 403 });
  }

  await db.collection("projects").deleteOne({ _id: objectId });

  // Optionally delete PPTX via project.pptxUrl he

  return new Response(null, { status: 204 });
}
