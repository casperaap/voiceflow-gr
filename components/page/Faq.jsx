// app/components/Faq.jsx
"use client";
import FaqCtaBanner from "./FaqCtaBanner";

export default function Faq() {
  const faqData = [
    {
      q: "What is VoiceFlow and how does it work with PowerPoint presentations?",
      a: `VoiceFlow is a browser-based platform that lets you upload PowerPoint (.pptx) files and present them online. Like other platforms you can control your slides with a remote, and your keyboard but unlike others you can also control them with your voice.`,
    },
    {
      q: "Is VoiceFlow free to use?",
      a: `No, VoiceFlow is currently not free to use and only available for exclusive members.`,
    },
    {
      q: "Are there any file size or slide count limits for VoiceFlow presentations?",
      a: `VoiceFlow doesn’t enforce a strict file size or slide count limit for uploads, but extremely large presentations may take longer to upload or process. In practice, you can upload a typical PowerPoint deck with dozens of slides without issues.`,
    },
    {
      q: "Do I need to create an account to use VoiceFlow?",
      a: `Yes. To ensure a better and more personal experience, creating an account is required to start using VoiceFlow. You can begin presenting right away after your sign-up.`,
    },
    {
      q: "Do I need to install any software or plug-ins to get started?",
      a: `No downloads or installations are needed. VoiceFlow runs entirely in your web browser, so you won’t have to install any software, plug-ins, or extensions. Just open the VoiceFlow dashboard and you’re ready to go.`,
    },
    {
      q: "Is VoiceFlow easy to use for beginners?",
      a: `Yes. VoiceFlow is designed to be very user-friendly. Simply upload your pptx file, choose your control words and start the slideshow. The interface is very straightforward and limited to what matters.`,
    },
    { q: "Is it safe to upload my presentations to VoiceFlow?",
      a: "Yes. VoiceFlow takes security seriously. Your uploaded presentations aren't transmitted over the web and stay locally stored on your computer. " },
    {
      q: "Is VoiceFlow an alternative to PowerPoint or just a viewer?",
      a: `VoiceFlow is an alternative way to present PowerPoints, but not a slide creation tool. You still create your slides in PowerPoint (or another program), but you use VoiceFlow to present those slides online. In essence, it serves as an online PowerPoint viewer with the perk of voice control.`,
    },
    {
      q: "What file formats does VoiceFlow support?",
      a: `VoiceFlow currently supports PowerPoint .pptx files, the standard format for PowerPoint presentations. (Support for additional formats will be added over time. For example, older .ppt files or other presentation formats might be converted to .pptx before uploading to VoiceFlow. But the primary format to use is .pptx for best results.)`,
    },
    {
      q: "What presentation controls does VoiceFlow offer?",
      a: `VoiceFlow provides all the basic controls you need for a smooth presentation. On top of our voice controlled navigation you can also advance forward or back with keyboard keys or a remote.`,
    },
    { q: "Does VoiceFlow support PowerPoint animations and transitions?",
      a: "VoiceFlow renders a clean, static preview of your PowerPoint slides directly in the browser. Animations and slide transitions aren’t supported. Any builds or effects appear as a single static slide. This keeps presentations fast, reliable, and easy to control by voice." },
    {
      q: "How can I get support if I have issues with VoiceFlow?",
      a: `If you encounter any problems or have questions while using VoiceFlow, you can reach out to our support team for help. Simply send an email to casper.apers@gmail.com and we’ll get back to you in no time.`,
    },
  ];

  return (
    <section id="faq" className="bg-[#ebeffc] py-12 md:py-32 px-4 flex flex-col items-center gap-2 md:gap-12 scroll-mt-20">
      <h2 className="text-3xl md:text-5xl font-semibold text-black mb-4 mx-4 md:mx-0 text-center">
        Have questions? We have answers
      </h2>

      <div className="w-full max-w-3xl space-y-1 md:space-y-4">
        {faqData.map((item, idx) => (
          <details
            key={idx}
            className="rounded-lg overflow-hidden group"
          >
            <summary
  className="group w-full flex justify-between items-center px-2 md:px-6 py-3 md:py-4 cursor-pointer list-none bg-transparent hover:bg-bgsec"
>
  <span className="font-medium max-w-[260px] md:max-w-full text-base md:text-xl -mr-8 md:mr-0 text-gray-500">
    {item.q}
  </span>

  {/* + / – icon */}
  <span className="relative inline-flex items-center justify-center w-5 h-5 text-gray-500" aria-hidden="true">
    {/* plus (default) */}
    <svg
      className="w-5 h-5 group-open:hidden"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
    {/* minus (when open) */}
    <svg
      className="hidden w-5 h-5 group-open:block"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </span>
</summary>
            <div className="px-2 md:px-6 py-4 md:py-8 text-parag whitespace-pre-line bg-transparent">
              {item.a}
            </div>
          </details>
        ))}
      </div>
      <FaqCtaBanner />
    </section>
  );
}