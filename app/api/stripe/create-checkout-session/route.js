// app/api/stripe/create-checkout-session/route.js
import { NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";
import { auth } from "@/auth";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  // Load user from Mongo to check hadTrial + stripeCustomerId
  const userDoc = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.user.id) });

  const hadTrial = userDoc?.billing?.hadTrial === true;
  const existingCustomerId = userDoc?.billing?.stripeCustomerId || null;

  const params = {
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // your VoiceFlow price
        quantity: 1,
      },
    ],
    success_url:
      `${process.env.NEXT_PUBLIC_APP_URL}` +
      `/api/stripe/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    client_reference_id: session.user.id,
    metadata: {
      userId: session.user.id,
    },
  };

  // Reuse Stripe customer if we have one, otherwise use email
  if (existingCustomerId) {
    params.customer = existingCustomerId;
  } else {
    params.customer_email = session.user.email;
  }

  // Only first time: give trial
  if (!hadTrial) {
    params.subscription_data = {
      trial_period_days: 7,
    };
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe create-checkout-session error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
