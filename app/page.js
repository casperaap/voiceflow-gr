export const metadata = {
    title: "Control powerpoints with your voice | VoiceFlow",
    description:
      "Generate 100s of winning video ads from text using AI Actors—fast, cost-effective, and scalable.",
    keywords: [
      "AI video ads",
      "AI Actors",
      "video marketing",
      "UGCreative",
      "automated video production",
    ],
  alternates: { canonical: "/" },};
  
  export const revalidate = 3600;   // ISR hourly
export const dynamic = 'error';   // disallow dynamic rendering

import Header from "../components/page/Header";          // client
import Hero from "../components/page/Hero";              // client
import Gradientsec from "../components/page/Gradientsec";// server (no hooks)
import Darkgradientsec from "../components/page/Darkgradientsec";// server or client
import StepsSection from "../components/page/StepsSection";// server
import Reviews from "../components/page/Reviews";        // server
import Faq from "../components/page/Faq";                // client
import Footer from "../components/Footer";          // server (if no hooks)

export default function Page() {

  const heroCopy = {
    titleLine: "Control PowerPoint Presentations Using ",
    highlight: "Your Voice",
    description: "Navigate slides, execute commands, and present seamlessly. All hands-free with AI-powered voice recognition.",
    buttonText: "Start Free Trial",
    ctaHref: "/dashboard",
  };
  const controlVideoCopy = {
    heading: "Take full control of your slides", //THIS IS REALLY DYNAMIC
    highlight: "full control", //THIS IS REALLY DYNAMIC
    text: "Modify trigger words for a more intuitive, personal, and captivating presentation.", //THIS IS REALLY DYNAMIC
  };

return (
    <div className="min-h-screen flex flex-col bg-[#ebeffc] font-sans scroll-smooth">
      <Header />
      <main className="flex-1 pt-16 md:pt-0">
        <Hero copy={heroCopy} />
        <Gradientsec />
        <Darkgradientsec copy={controlVideoCopy} />
        <StepsSection />
        <Reviews />
        <Faq />
      </main>
      <Footer />
    </div>
  );}