import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * CursorFollower — Premium Antarctic Light Polar Interactive Cursor
 * 
 * Features:
 * - Small circular outline (38px) with thin crisp border
 * - Tiny center dot (6px)
 * - Fluid delayed lerp movement using Framer Motion springs
 * - Interactive hover reactions for links, buttons, and editorial titles
 * - Click scale-down feedback
 * - Auto-disabled on mobile / touch devices
 * - Zero React re-renders on mousemove
 */
export default function CursorFollower() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'link' | 'title' | 'button'
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates (no state re-renders)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer circle spring (subtle fluid delayed lag)
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 320, mass: 0.45 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 320, mass: 0.45 });

  // Center dot spring (tighter, nearly instantaneous tracking)
  const dotX = useSpring(mouseX, { damping: 45, stiffness: 900, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 45, stiffness: 900, mass: 0.1 });

  useEffect(() => {
    // Check if the device has hover capability and fine pointer (mouse/trackpad)
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasMouse) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    // Apply cursor: none to body when on desktop
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Delegation handler for hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      if (target.closest('.hero-title') || target.closest('.section-title')) {
        setCursorState('title');
      } else if (target.closest('button') || target.closest('.cursor-pointer') || target.closest('a')) {
        setCursorState('link');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice) return null;

  // Ring styling calculations based on cursor state
  let ringSize = 38;
  let ringBorderColor = 'rgba(51, 133, 198, 0.45)'; // Polar Sky Blue
  let ringBg = 'rgba(51, 133, 198, 0.03)';
  let dotSize = 6;
  let dotColor = '#3385C6';

  if (cursorState === 'link') {
    ringSize = 52;
    ringBorderColor = '#3385C6';
    ringBg = 'rgba(51, 133, 198, 0.08)';
    dotSize = 5;
  } else if (cursorState === 'title') {
    ringSize = 68;
    ringBorderColor = 'rgba(30, 58, 82, 0.4)';
    ringBg = 'rgba(232, 243, 250, 0.35)';
    dotSize = 7;
    dotColor = '#1E3A52';
  }

  const scale = isClicking ? 0.84 : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Outer Circle Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          x: '-50%',
          y: '-50%',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1.5px solid ${ringBorderColor}`,
          backgroundColor: ringBg,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          borderColor: ringBorderColor,
          backgroundColor: ringBg,
          scale: scale,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 300,
        }}
      />

      {/* Center Precision Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: dotColor,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: dotSize,
          height: dotSize,
          backgroundColor: dotColor,
          scale: scale,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 400,
        }}
      />
    </div>
  );
}
