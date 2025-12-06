// app/api/me/route.js
import clientPromise from "@/libs/mongo";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Get the Auth.js user document to read createdAt
  const userDoc = await db.collection("users").findOne({
    _id: new ObjectId(session.user.id),
  });

  const projectCount = await db
    .collection("projects")
    .countDocuments({ userId: session.user.id });

  const payload = {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      joinedAt: userDoc?.createdAt || null,
      billing: userDoc?.billing || null,   // 👈 add this

    },
    stats: {
      projectCount,
    },
  };

  return Response.json(payload);
}
