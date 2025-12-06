// app/api/stripe/create-portal-session/route.js
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/libs/stripe";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.user.id) });

  const customerId = user?.billing?.stripeCustomerId;

  // If they don't have a Stripe customer yet, send them to subscribe instead
  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer for user", redirectTo: "/subscribe" },
      { status: 400 }
    );
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("create-portal-session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
