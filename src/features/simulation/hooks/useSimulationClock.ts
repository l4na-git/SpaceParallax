import { useEffect, useState } from 'react';

export function useSimulationClock(paused: boolean, speedMultiplier: number) {
  const [simulatedDays, setSimulatedDays] = useState(0);

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    let frameId = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = (now - previous) / 1000;
      previous = now;
      setSimulatedDays((value) => value + deltaSeconds * speedMultiplier * 8);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [paused, speedMultiplier]);

  return simulatedDays;
}
