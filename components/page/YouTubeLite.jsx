// components/YouTubeLite.jsx
"use client";
import { useState } from "react";

export default function YouTubeLite({ id, title }) {
  const [playing, setPlaying] = useState(false);
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const posterLocal = `/images/${id}.webp`;
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`;

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        title={title}
        src={src}
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="relative w-full h-full overflow-hidden group"
      aria-label={`Play ${title}`}
    >
      <picture>
  <source srcSet={posterLocal} type="image/webp" />
  <img
    src={poster}
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
    loading="lazy"
    decoding="async"
  />
</picture>
      <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        {/* YouTube play shape */}
        <svg viewBox="0 0 68 48" width="68" height="48" className="opacity-90 group-hover:scale-105 transition">
          <path d="M66.52 7.74a8 8 0 00-5.64-5.66C56.73 1 34 1 34 1S11.27 1 7.12 2.08a8 8 0 00-5.64 5.66A83.2 83.2 0 000 24a83.2 83.2 0 001.48 16.26 8 8 0 005.64 5.66C11.27 47 34 47 34 47s22.73 0 26.88-1.08a8 8 0 005.64-5.66A83.2 83.2 0 0068 24a83.2 83.2 0 00-1.48-16.26z" fill="#f00"/>
          <path d="M45 24L27 14v20l18-10z" fill="#fff"/>
        </svg>
      </span>
    </button>
  );
}