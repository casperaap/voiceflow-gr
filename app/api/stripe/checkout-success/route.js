// app/api/stripe/checkout-success/route.js
import { NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Get Checkout Session + Subscription from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["subscription"] }
    );

    const userId =
      checkoutSession.client_reference_id ||
      checkoutSession.metadata?.userId;

    if (!userId) {
      console.error("No userId on checkout session");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      );
    }

    const subscription = checkoutSession.subscription;

    const client = await clientPromise;
    const db = client.db();

    const update = {
      $set: {
        "billing.stripeCustomerId": checkoutSession.customer,
        "billing.stripeSubscriptionId": subscription?.id ?? null,
        "billing.status": subscription?.status ?? checkoutSession.status,
        "billing.currentPeriodEnd": subscription?.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
      },
    };

    // If this subscription had a trial, remember that forever
    if (subscription?.trial_end) {
      update.$set["billing.hadTrial"] = true;
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, update);

    // Send them to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );
  } catch (error) {
    console.error("checkout-success error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/billing/error`
    );
  }
}
