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
      {/* Glacial light polar gradient fallback */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 70% 30%, rgba(204, 224, 240, 0.45) 0%, transparent 65%),
            radial-gradient(ellipse at 20% 80%, rgba(232, 243, 250, 0.6) 0%, transparent 60%),
            linear-gradient(175deg, #FFFFFF 0%, #F4F8FB 50%, #E8F3FA 100%)
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
        style={{ opacity: 0.22, filter: 'contrast(1.1) brightness(1.1)' }}
        onError={() => {
          if (videoRef.current) videoRef.current.style.display = 'none';
        }}
      />

      {/* Light Glacial Frost Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(244, 248, 251, 0.4) 0%,
              rgba(244, 248, 251, 0.1) 40%,
              rgba(244, 248, 251, 0.65) 80%,
              rgba(244, 248, 251, 0.95) 100%
            )
          `,
        }}
      />

      {/* Subtle fine polar grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, #CCE0F0 1px, transparent 1px),
            linear-gradient(to bottom, #CCE0F0 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />
    </div>
  );
}
