// app/layout.js   – ❄️ **server component** (noo "use client")
import "./globals.css";
import ClientProviders from "./SessionWrapper";     // ← tiny wrapper with "use client"
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { hiragino } from "./fonts";
/* Google fonts */
const geistSans = Geist({  variable: "--font-geist-sans",  subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/* <head> metadata */
export const metadata = {
  metadataBase: new URL("https://www.voiceflow.us"),
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
  alternates: { canonical: "/" },robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "VoiceFlow",
    title: "VoiceFlow - Control powerpoints with your voice",
    description:
      "Seemlessly control your PowerPoint presentations using voice commands. Navigate slides, execute actions, and present hands-free with AI-powered voice recognition.",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@YourTwitterHandle",
    title: "VoiceFlow - Control powerpoints with your voice",
    description:
      "Seemlessly control your PowerPoint presentations using voice commands. Navigate slides, execute actions, and present hands-free with AI-powered voice recognition.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className="h-full">
      <head>
      <link rel="preconnect" href="https://www.ugcreative.ai" crossOrigin="" />
      <link rel="dns-prefetch" href="https://www.ugcreative.ai" />

<link rel="preconnect" href="https://connect.facebook.net" crossOrigin="" />
<link rel="preconnect" href="https://www.facebook.com" crossOrigin="" />
<link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />

{/* fallback if preconnect is ignored */}
<link rel="dns-prefetch" href="https://connect.facebook.net" />
<link rel="dns-prefetch" href="https://www.facebook.com" />
<link rel="dns-prefetch" href="https://i.ytimg.com" />

<link
  rel="preload"
  as="image"
  href="/videos/win7-320.avif"
  imageSrcSet="/videos/win7-320.avif 320w"
  imageSizes="(max-width: 767px) 280px, 560px"
  fetchPriority="high"
  media="(max-width: 767px)"
/>

      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2YB956NVP0"
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2YB956NVP0', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
<Script id="gtm-bootstrap" strategy="lazyOnload">
  {`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KQMXP4H');
`}
</Script>
<Script id="gtm-signup-bridge" strategy="afterInteractive">{`
  try {
    // read cookie value by name
    function readCookie(name){
      const m = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
      return m ? m.pop() : '';
    }
    var flag = readCookie('new_signup');
    if (flag === '1') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sign_up' });
      // delete the cookie so it won't fire again
      document.cookie = 'new_signup=; Max-Age=0; path=/; SameSite=Lax';
    }
  } catch (e) {}
`}</Script>
<Script id="gtm-subscribe-bridge" strategy="afterInteractive">{`
  try {
    function readCookie(name){
      const m = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
      return m ? m.pop() : '';
    }
    var raw = readCookie('new_subscribe');
    if (raw) {
      var data = {};
      try { data = JSON.parse(raw); } catch(e) {}
      // data = { v: value, c: currency, t: transaction_id }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'subscribe',
        value: Number(data.v) || undefined,
        currency: data.c || undefined,
        transaction_id: data.t || undefined
      });
      // delete the cookie so it won't fire again
      document.cookie = 'new_subscribe=; Max-Age=0; path=/; SameSite=Lax';
    }
  } catch (e) {}
`}</Script>

        {/* Meta / Facebook Pixel */}
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1186091489522481');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=1186091489522481&ev=PageView&noscript=1"
            />`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${hiragino.variable} antialiased min-h-full`}>
      <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-KQMXP4H"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>


  );
}
