import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";

const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "noreply@dev.mrapers.com",
      name: "Email",
    }),
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),

  // 🔹 Events run on certain auth actions
  events: {
    // Runs ONCE when a brand-new user is created
    async createUser({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const now = new Date();

        const baseProject = {
          userId: user.id,      // we store the user id as string
          createdAt: now,
          updatedAt: now,
          nextTrigger: "",
          prevTrigger: "",
          stopTrigger: "",
          queue: [],
          advancedEnabled: false,
          pptxUrl: null,
        };

        await db.collection("projects").insertMany([
          { ...baseProject, name: "Project 1" },
          { ...baseProject, name: "Project 2" },
          { ...baseProject, name: "Project 3" },
        ]);
      } catch (err) {
        console.error("Error creating default projects for new user:", err);
        // we don't throw here so login still succeeds even if this fails
      }
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
