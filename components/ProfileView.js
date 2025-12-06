// components/ProfileView.js
"use client";

import { useState, useEffect } from "react";

export default function ProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full rounded-2xl border border-white/10 flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #28335080 0%, #32416A80 100%)', padding: '24px 28px' }}>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-full rounded-2xl border border-white/10 flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #28335080 0%, #32416A80 100%)', padding: '24px 28px' }}>
        <div className="text-white/50">Unable to load profile</div>
      </div>
    );
  }

  const userName = user.user?.name || "User";
  const userEmail = user.user?.email || "";
  const joinedDate = user.user?.joinedAt 
    ? new Date(user.user.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const projectCount = user.stats?.projectCount || 0;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="w-full h-full rounded-2xl border border-white/10"
         style={{ background: 'linear-gradient(135deg, #28335080 0%, #32416A80 100%)', padding: '24px 28px', boxShadow: '0 18px 45px #2B74700D ' }}>

      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
        </svg>
        <h3 className="text-white font-semibold text-[20px]">Profile</h3>
      </div>

      {/* Top: Full-width profile card */}
      <div className="rounded-2xl p-5 border border-white/5 mb-4"
           style={{background: 'linear-gradient(180deg, #324162 0%, #283554 100%)',}}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
               style={{ background: 'linear-gradient(135deg, #53C1BC 0%, #3FA29E 45%, #2B7470 100%)' }}>
            {initial}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-[17px]">{userName}</div>
                <div className="text-xs text-white/70 mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                  <span>{userEmail}</span>
                </div>
              </div>

              <div className="text-xs text-white/70">Joined: <span className="font-medium text-white">{joinedDate}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: two small cards side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 border border-white/5"
             style={{background: 'linear-gradient(180deg, #324162 0%, #283554 100%)',}}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #53C1BC 0%, #3FA29E 45%, #2B7470 100%)' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-white/60">Subscription</div>
              <div className="text-sm text-white font-medium mt-1">Pro</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-white/5"
             style={{background: 'linear-gradient(180deg, #324162 0%, #283554 100%)',}}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #53C1BC 0%, #3FA29E 45%, #2B7470 100%)' }}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l9 4.5-9 4.5-9-4.5L12 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.5l-9 4.5-9-4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 17l-9 4.5L3 17" />
          </svg>
            </div>
            <div>
              <div className="text-xs text-white/60">Projects</div>
              <div className="text-sm text-white font-medium mt-1">{projectCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
