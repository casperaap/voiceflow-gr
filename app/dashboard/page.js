// app/dashboard/page.js
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";
import DashboardLayout from "@/components/DashboardLayout";

export const runtime = "nodejs";

export default async function DashboardPage() {
  // 1) User must be logged in
  const session = await auth();
  if (!session?.user) {
    // You can use "/sign-in" if you prefer your custom page
    redirect("/api/auth/signin");
  }

  // 2) Load user + billing from Mongo
  const client = await clientPromise;
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.user.id) });

  const billing = user?.billing || null;
  const status = billing?.status || null;
  const now = new Date();

  // 3) Handle "no billing at all" (never went through checkout)
  if (!billing || !status) {
    // Logged in, but no plan at all → send them to start checkout
    redirect("/subscribe");
  }

  // 4) Always-allowed statuses
  const OK_STATUSES = ["trialing", "active"];
  if (OK_STATUSES.includes(status)) {
    return <DashboardLayout />;
  }

  // 5) Grace logic for past_due / unpaid
  if (status === "past_due" || status === "unpaid") {
    const periodEnd = billing.currentPeriodEnd
      ? new Date(billing.currentPeriodEnd)
      : null;

    if (periodEnd) {
      const graceEnd = new Date(periodEnd);
      graceEnd.setDate(graceEnd.getDate() + 7); // 7-day grace

      // Still within grace window → allow
      if (now <= graceEnd) {
        return <DashboardLayout />;
      }
    }

    // Out of grace window → must go re-subscribe
    redirect("/subscribe");
  }

  // 6) Everything else is blocked:
  //    canceled, incomplete, incomplete_expired, paused, etc.
  redirect("/subscribe");
}
