export const metadata = {
    title: "VoiceFlow - Control powerpoints with your voice",
    description:
      "Seemlessly control your PowerPoint presentations using voice commands. Navigate slides, execute actions, and present hands-free with AI-powered voice recognition.",
    keywords: [
      "Powerpoint",
      "Remote Control",
      "voice control",
      "Presentation",
      "Automatic Slide Navigation",
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