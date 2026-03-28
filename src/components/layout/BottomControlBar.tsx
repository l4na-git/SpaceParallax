import { useAppStore } from '../../store/useAppStore';

const speedOptions = [1, 10, 100] as const;

export function BottomControlBar() {
  const paused = useAppStore((state) => state.simulation.settings.paused);
  const speedMultiplier = useAppStore((state) => state.simulation.settings.speedMultiplier);
  const togglePaused = useAppStore((state) => state.togglePaused);
  const setSpeedMultiplier = useAppStore((state) => state.setSpeedMultiplier);
  const setAddObjectPanelOpen = useAppStore((state) => state.setAddObjectPanelOpen);

  return (
    <div className="panel absolute bottom-6 left-1/2 z-30 flex w-[min(58vw,760px)] -translate-x-1/2 items-center justify-between rounded-sm px-8 py-4">
      <div className="flex items-center gap-4">
        <button className="text-white/40">⏮</button>
        <button
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300 text-2xl text-black shadow-[0_0_26px_rgba(21,231,255,0.36)]"
          onClick={togglePaused}
        >
          {paused ? '▶' : '❚❚'}
        </button>
        <button className="text-white/40">⏭</button>
      </div>

      <div className="rounded-sm border border-white/8 bg-black/15 px-4 py-2">
        <div className="flex gap-2">
          {speedOptions.map((speed) => {
            const active = speed === speedMultiplier;
            return (
              <button
                key={speed}
                className={`headline-mono rounded-sm px-4 py-2 text-[11px] tracking-[0.2em] ${
                  active ? 'bg-cyan-300/18 text-cyan-200' : 'text-white/46'
                }`}
                onClick={() => setSpeedMultiplier(speed)}
              >
                {speed}X
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="headline-mono rounded-sm border border-cyan-300/80 bg-cyan-300 px-6 py-4 text-sm font-semibold tracking-[0.24em] text-black"
        onClick={() => setAddObjectPanelOpen(true)}
      >
        New Object
      </button>
    </div>
  );
}
