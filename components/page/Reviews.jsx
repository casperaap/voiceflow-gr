// app/components/Reviews.jsx
import Image from "next/image";
import ScrollFadeIn from "../ScrollFadeIn";

export default function Reviews() {
  const reviews = [
{
  title: "Game Changer for Classrooms",
  text: "VoiceFlow lets me upload a .pptx, open it in the browser, and run the entire lecture with my voice. I can move around, write on the board, and jump to examples or review slides without touching a clicker. It keeps the class focused on me, not my laptop.",
  avatar: "angelo.png",
  name: "Dr. Sara Nguyen",
  role: "University Lecturer",
},
{
  title: "Client Demos Without a Clicker",
  text: "As a sales engineer, VoiceFlow keeps my demos smooth when things get hectic. I control slides by voice and pull up backup content mid-call without hunting for buttons or cables. It’s one less thing to worry about in front of customers.",
  avatar: "oya.png",
  name: "Jordan Lee",
  role: "Sales Engineer",
},
{
  title: "Stage-Ready and Hands-Free",
  text: "As an event host, I’m always moving and VoiceFlow keeps me in the moment. I upload the deck, go full screen in the browser, and cue every slide with my voice. The show flows, and the audience gets my full attention.",
  avatar: "alexcoop.jpeg",
  name: "Ava Martinez",
  role: "Event Host & MC",
},
  ];

  return (
    <ScrollFadeIn>
    <section className="bg-[#ebeffc] py-0 md:py-0 -mt-4 md:mt-0 px-4">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        {reviews.map(({ title, text, avatar, name, role }) => (
          <article
            key={title}
            className="bg-gray-100 p-6 md:p-8 rounded-2xl flex flex-col gap-4 md:gap-6 shadow-lg"
          >
            <Image src="/images/stars.png" alt="stars" width={120} height={24} />
            <h2 className="font-semibold text-base md:text-lg leading-snug text-black">
              {title}
            </h2>
            <p className="text-parag text-sm md:text-base flex-1 leading-relaxed">
              {text}
            </p>
            <div className="flex items-center gap-4">
              <Image
                src={`/images/${avatar}`}
                alt={name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-black text-sm md:text-base">{name}</p>
                <p className="text-parag text-xs mt-1 md:text-sm">{role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
    </ScrollFadeIn>
  );
}