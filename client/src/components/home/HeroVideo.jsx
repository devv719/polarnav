import React, { useRef, useEffect } from 'react';

/**
 * HeroVideo — Full-screen cinematic background video
 *
 * Drop antarctica-hero.mp4 into client/public/videos/ to activate.
 * Falls back to a pure CSS gradient that still looks cinematic.
 */
export default function HeroVideo({ opacity = 1 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked — video will start on first user gesture
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      {/* Gradient fallback (always visible behind video) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 70%, rgba(0,60,100,0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 20%, rgba(0,40,80,0.4) 0%, transparent 55%),
            linear-gradient(170deg, #000000 0%, #020d1f 40%, #050810 100%)
          `,
        }}
      />

      {/* Video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/antarctica-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity: 0.75 }}
        onError={() => {
          if (videoRef.current) videoRef.current.style.display = 'none';
        }}
      />

      {/* Dark cinematic overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(0,0,0,0.55) 0%,
              rgba(0,0,0,0.25) 40%,
              rgba(0,0,0,0.6) 80%,
              rgba(0,0,0,0.85) 100%
            )
          `,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
