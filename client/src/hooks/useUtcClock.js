import { useState, useEffect } from 'react';

/**
 * Hook providing live UTC and Antarctic Mission operational clocks
 */
export function useUtcClock() {
  const [now, setNow] = useState(() => new Date());


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const utcTime = now.toUTCString().replace('GMT', 'UTC');
  const utcIso = now.toISOString().slice(11, 19) + ' UTC';
  const utcDate = now.toISOString().slice(0, 10);

  // Maitri / Bharati expedition mission day count or offset
  const missionDay = 'EXP-45 / D-28';

  return {
    now,
    utcTime,
    utcIso,
    utcDate,
    missionDay
  };
}
