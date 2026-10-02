import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero',    num: '—',   label: 'POLARNAV' },
  { id: 'map',     num: '01',  label: 'POLAR MAP' },
  { id: 'sea-ice', num: '02',  label: 'SEA ICE' },
  { id: 'icebergs',num: '03',  label: 'ICEBERGS' },
  { id: 'routes',  num: '04',  label: 'ROUTES' },
  { id: 'ocean',   num: '05',  label: 'OCEAN' },
  { id: 'mission', num: '06',  label: 'MISSION' },
];

export default function SectionNavigation({ active }) {
  const handleClick = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className="fixed right-8 top-1/2 z-40 hidden lg:flex flex-col gap-4"
      style={{ transform: 'translateY(-50%)' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => handleClick(s.id)}
            className="group flex items-center justify-end gap-3 text-right cursor-pointer py-1"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {/* Label — appears on active or hover */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  className="font-mono text-[#1E3A52] font-semibold text-[10px] tracking-[0.18em] uppercase"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  {s.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot indicator */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <motion.div
                className="rounded-full"
                animate={{
                  width: isActive ? 7 : 3.5,
                  height: isActive ? 7 : 3.5,
                  backgroundColor: isActive ? '#3385C6' : '#CCE0F0',
                  boxShadow: isActive ? '0 0 8px rgba(51,133,198,0.45)' : 'none',
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Hover ring */}
              <motion.div
                className="absolute rounded-full border border-[#3385C6]/40"
                style={{ width: 14, height: 14 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </button>
        );
      })}
    </motion.nav>
  );
}
