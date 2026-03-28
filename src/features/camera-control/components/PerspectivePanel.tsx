import { useAppStore } from '../../../store/useAppStore';

export function PerspectivePanel() {
  const perspectiveMode = useAppStore((state) => state.ui.perspectiveMode);
  const setPerspectiveMode = useAppStore((state) => state.setPerspectiveMode);
  const cameraControl = useAppStore((state) => state.cameraControl);
  const setCameraControl = useAppStore((state) => state.setCameraControl);
  const tracking = useAppStore((state) => state.tracking);
  const setTrackingEnabled = useAppStore((state) => state.setTrackingEnabled);

  return (
    <div className="panel scanlines absolute top-20 right-6 z-30 w-72 rounded-sm px-5 py-5 text-xs">
      <div className="mb-4 flex items-center justify-between text-[10px] tracking-[0.28em] text-white/45">
        <span>PERSPECTIVE</span>
        <span className="accent-text">{perspectiveMode}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['FOCUS_TRACK', 'FACE UI'],
          ['3D_DEEP_FIELD', 'DEEP FIELD'],
        ].map(([mode, label]) => {
          const active = perspectiveMode === mode;
          return (
            <button
              key={mode}
              className={`rounded-sm border px-3 py-4 text-left transition ${
                active
                  ? 'border-cyan-300/70 bg-cyan-300/20 text-cyan-200 shadow-[0_0_24px_rgba(21,231,255,0.14)]'
                  : 'border-white/8 bg-white/[0.03] text-white/70 hover:border-cyan-400/35'
              }`}
              onClick={() => setPerspectiveMode(mode as '3D_DEEP_FIELD' | 'FOCUS_TRACK')}
            >
              <div className="mb-2 text-lg">+</div>
              <div className="headline-mono text-[10px]">{label}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="section-label">Horizontal Offset</span>
            <span>{cameraControl.horizontalOffset.toFixed(1)}</span>
          </div>
          <input
            className="range-accent w-full"
            max={10}
            min={-10}
            onChange={(event) => setCameraControl({ horizontalOffset: Number(event.target.value) })}
            step={0.1}
            type="range"
            value={cameraControl.horizontalOffset}
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="section-label">Vertical Offset</span>
            <span>{cameraControl.verticalOffset.toFixed(1)}</span>
          </div>
          <input
            className="range-accent w-full"
            max={8}
            min={-8}
            onChange={(event) => setCameraControl({ verticalOffset: Number(event.target.value) })}
            step={0.1}
            type="range"
            value={cameraControl.verticalOffset}
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="section-label">Field Depth</span>
            <span>{cameraControl.depth.toFixed(1)}</span>
          </div>
          <input
            className="range-accent w-full"
            max={52}
            min={22}
            onChange={(event) => setCameraControl({ depth: Number(event.target.value) })}
            step={0.5}
            type="range"
            value={cameraControl.depth}
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-sm border border-white/8 bg-white/[0.03] px-3 py-3">
        <div>
          <div className="section-label">Face Tracking</div>
          <div className="mt-1 text-white/70">{tracking.message}</div>
        </div>
        <button
          className={`headline-mono rounded-sm border px-3 py-2 text-[10px] ${
            tracking.enabled
              ? 'border-cyan-300/70 bg-cyan-300/18 text-cyan-200'
              : 'border-white/10 text-white/75'
          }`}
          onClick={() => setTrackingEnabled(!tracking.enabled)}
        >
          {tracking.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
