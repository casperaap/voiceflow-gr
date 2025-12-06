// libs/stripe.js
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // optional but good practice to pin an API version:
  // apiVersion: "2024-06-20",
});