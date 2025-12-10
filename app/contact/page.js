// app/contact/page.js
"use client";

import React from "react";
import Header from "@/components/page/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ebeffc] font-sans">
      <Header />

      <main className="flex-grow px-6 pt-24 pb-16 md:pt-16 max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At VoiceFlow, we are available 24/7 to assist you with any questions,
            concerns, or support needs. Whether you're looking for more information
            about our services, need technical assistance, or have any other
            inquiries, we're here to help.
          </p>
        </div>

        {/* Get in Touch Section */}
        <section className="mb-16 bg-gray-50 rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-black mb-8">Get in Touch</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-[#53C1BC]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                For general inquiries or support, reach out to us at:
              </p>
              <a
                href="mailto:casper.apers@gmail.com"
                className="text-[#53C1BC] font-semibold hover:text-[#3FA29E] transition"
              >
                casper.apers@gmail.com
              </a>
              <p className="text-gray-500 text-sm mt-4">
                We strive to respond to all emails as quickly as possible.
              </p>
            </div>

            {/* Discord */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-[#53C1BC]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.975 14.975 0 001.293-2.1a.07.07 0 00-.038-.098a13.11 13.11 0 01-1.872-.892a.072.072 0 01-.009-.119c.126-.094.252-.192.372-.291a.071.071 0 01.074-.01c3.928 1.793 8.18 1.793 12.062 0a.071.071 0 01.074.009c.12.099.246.198.373.292a.072.072 0 01-.008.119c-.598.35-1.22.645-1.873.89a.07.07 0 00-.037.099c.36.687.772 1.341 1.294 2.099a.078.078 0 00.084.028a19.963 19.963 0 006.002-3.03a.079.079 0 00.033-.057c.5-4.761-.838-8.88-3.546-12.541a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.193 0 2.156.964 2.156 2.157c0 1.19-.963 2.156-2.156 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.193 0 2.156.964 2.156 2.157c0 1.19-.963 2.156-2.156 2.156z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Discord Support</h3>
              <p className="text-gray-600 mb-4">
                For immediate assistance, open a support ticket in our Discord server.
              </p>
              <a
                href="#"
                className="text-[#53C1BC] font-semibold hover:text-[#3FA29E] transition"
              >
                Coming Soon!
              </a>
              <p className="text-gray-500 text-sm mt-4">
                Get real-time help from our dedicated team.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Stay Connected</h2>

          <div className="bg-gradient-to-r from-[#53C1BC]/10 via-[#3FA29E]/10 to-[#2B7470]/10 rounded-lg p-8 md:p-12 border border-[#53C1BC]/30">
            <p className="text-gray-600 mb-6 text-lg">
              Stay updated with the latest news, offers, and insights through our
              official social media channels:
            </p>

            <div className="flex items-center gap-4 mb-6">
              <svg
                className="w-8 h-8 text-[#53C1BC]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.76-5.881 6.76h-3.308l7.73-8.835L2.744 2.25h6.75l4.915 6.516 5.334-6.516zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <div>
                <p className="text-black font-semibold">X (formerly Twitter)</p>
                <a
                  href="https://twitter.com/voiceflow"
                  className="text-[#53C1BC] font-semibold hover:text-[#3FA29E] transition"
                >
                  @voiceflow
                </a>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              Follow us for product updates, tips, and community highlights.
            </p>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="text-center py-8 border-t border-gray-200">
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We look forward to assisting you and providing top-quality voice-controlled
            presentation solutions tailored to your needs.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
