// app/fonts.js
import localFont from "next/font/local";

export const hiragino = localFont({
  src: [
    // if you have only W6 for now, this single entry is fine:
    { path: "./fonts/hiragino/HiraginoKakuGothic.woff2", weight: "700", style: "normal" },

    // (optional) add W3 later as 400:
    // { path: "./fonts/hiragino/HiraginoKakuGothic-W3.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-hiragino",
  display: "swap",
});