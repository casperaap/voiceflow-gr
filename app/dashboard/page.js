// app/dashboard/page.js
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";
import DashboardLayout from "@/components/DashboardLayout";

export const runtime = "nodejs";

function MobileBlocker() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#1a1f35] to-[#0f1419] flex items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <img
            src="/images/vf-icon-green (2).png"
            alt="VoiceFlow Icon"
            className="w-16 h-16"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Open Dashboard on Computer
        </h1>
        <p className="text-base text-white/70 mb-8 leading-relaxed">
          The presentation dashboard is optimized for desktop. Please visit VoiceFlow on your computer to access the full dashboard and manage your presentations.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-linear-to-r from-[#53C1BC] via-[#3FA29E] to-[#2B7470] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </a>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}

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
    return (
      <>
        {/* Mobile blocker */}
        <div className="md:hidden">
          <MobileBlocker />
        </div>
        {/* Desktop dashboard */}
        <div className="hidden md:block">
          <DashboardLayout />
        </div>
      </>
    );
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
        return (
          <>
            {/* Mobile blocker */}
            <div className="md:hidden">
              <MobileBlocker />
            </div>
            {/* Desktop dashboard */}
            <div className="hidden md:block">
              <DashboardLayout />
            </div>
          </>
        );
      }
    }

    // Out of grace window → must go re-subscribe
    redirect("/subscribe");
  }

  // 6) Everything else is blocked:
  //    canceled, incomplete, incomplete_expired, paused, etc.
  redirect("/subscribe");
}
