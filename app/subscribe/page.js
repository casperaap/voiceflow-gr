// app/subscribe/page.js
"use client";

import { useEffect } from "react";

export default function SubscribePage() {
  useEffect(() => {
    const goToCheckout = async () => {
      try {
        const res = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No checkout url returned");
        }
      } catch (err) {
        console.error("Error starting checkout", err);
      }
    };

    goToCheckout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting you to secure checkout…</p>
    </div>
  );
}
