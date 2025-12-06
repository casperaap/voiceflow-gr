// components/QuoteView.js
"use client";

import { useState, useEffect } from "react";

const quotes = [
  "The best clicker is your voice, because it is always in your hand anyway.",
  "When your voice runs the slides, your hands are free to tell the story.",
  "I stopped hunting for the remote and started speaking to my slides instead.",
  "Voice control turns a stiff talk into a living conversation with your audience.",
  "The moment I said next and it just worked I felt like a pro.",
  "Great speakers do not stare at buttons, voice control lets them look people in the eyes.",
  "Your story should flow with your voice not with a tiny plastic clicker.",
  "I used to juggle notes, laser pointer and remote, now I just talk.",
  "When tech feels invisible your ideas become impossible to ignore.",
  "Saying next out loud is easier than guessing which key to press.",
  "Keep your hands for energy and gestures and let your voice move the slides.",
  "Voice guided slides feel like a smart friend who always knows what comes next.",
  "The less you touch the laptop the more you connect with people in the room.",
  "Your voice is already your main tool, let it drive your presentation too.",
  "Good design removes friction and nothing feels smoother than talking your slides forward.",
  "I stopped fearing the clicker dying because my voice never runs out of battery.",
  "When your slides listen to you your audience starts to listen more as well.",
  "A calm mind starts with simple tools and voice control is as simple as it gets.",
  "Present like you are telling a story to a friend just talk and it moves.",
  "Once you try speaking to your slides going back to buttons feels like the stone age.",
];

export default function QuoteView() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="w-full h-full rounded-2xl border border-white/10 flex items-center justify-center"
         style={{ background: 'linear-gradient(135deg, #28335080 0%, #32416A80 100%)', padding: '24px 28px', boxShadow: '0 18px 45px #2B74701A' }}>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Large decorative opening quote */}
        <div className="absolute left-4 top-2 text-white/12 select-none" style={{ fontSize: 130, lineHeight: 1, color: '#3FA29E80' }}>“</div>
        {/* Large decorative closing quote */}
        <div className="absolute right-4 bottom-2 select-none" style={{ fontSize: 130, lineHeight: 0, color: '#3FA29E80' }}>”</div>
          
        <blockquote className="relative z-10 text-white text-center font-semibold leading-tight mx-auto" style={{ maxWidth: '48ch', fontSize: '20px' }}>
          {quote}
        </blockquote>
      </div>
    </div>
  );
}
