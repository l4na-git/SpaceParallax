import { useMemo, useState } from 'react';

import { useAppStore } from '../../store/useAppStore';

export function StatusCards() {
  const baseBodies = useAppStore((state) => state.simulation.baseBodies);
  const placedObjects = useAppStore((state) => state.simulation.placedObjects);
  const selectedBodyId = useAppStore((state) => state.simulation.selectedBodyId);
  const speedMultiplier = useAppStore((state) => state.simulation.settings.speedMultiplier);
  const tracking = useAppStore((state) => state.tracking);
  const [systemStatsMinimized, setSystemStatsMinimized] = useState(false);

  const selectedBody = useMemo(
    () => [...baseBodies, ...placedObjects].find((body) => body.id === selectedBodyId) ?? baseBodies[0],
    [baseBodies, placedObjects, selectedBodyId],
  );

  const totalMass = useMemo(
    () => [...baseBodies, ...placedObjects].reduce((sum, body) => sum + body.mass, 0).toFixed(1),
    [baseBodies, placedObjects],
  );

  return (
    <>
      <div className="panel absolute top-6 left-6 z-30 w-72 rounded-sm px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="headline-mono text-sm font-semibold accent-text">SYSTEM_STATS</div>
          <button
            type="button"
            className="headline-mono text-[0.65rem] text-white/60 transition hover:text-white"
            aria-expanded={!systemStatsMinimized}
            aria-label={systemStatsMinimized ? 'Expand system stats' : 'Minimize system stats'}
            onClick={() => setSystemStatsMinimized((current) => !current)}
          >
            {systemStatsMinimized ? 'EXPAND' : 'MIN'}
          </button>
        </div>
        {!systemStatsMinimized && (
          <div className="mt-6 space-y-5 text-xs text-white/62">
            <div>
              <div className="mb-2 flex justify-between">
                <span>Total Mass</span>
                <span>{totalMass} KG</span>
              </div>
              <div className="h-1 rounded-full bg-white/6">
                <div className="h-full w-11/12 rounded-full bg-cyan-300" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span>Field Depth</span>
                <span>DEEP_ZENITH</span>
              </div>
              <div className="h-1 rounded-full bg-white/6">
                <div className="h-full w-4/5 rounded-full bg-cyan-300" />
              </div>
            </div>

            <div className="pt-3">
              <div className="mb-2 section-label">Active Dynamics</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>3D_MESH_STABLE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span>{tracking.enabled ? 'FACE_INPUT_ON' : 'UI_PARALLAX_ONLY'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span>SPEED_{speedMultiplier}X</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="panel absolute top-1/2 left-64 z-30 w-72 -translate-y-1/2 rounded-sm px-6 py-5">
        <div className="section-label">Selected Body</div>
        <div className="mt-2 text-2xl font-semibold">{selectedBody.name}</div>
        <div className="mt-1 text-sm text-white/50">{selectedBody.kind.toUpperCase()}</div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="section-label">Mass</div>
            <div className="mt-2 text-white/82">{selectedBody.mass.toFixed(1)}</div>
          </div>
          <div>
            <div className="section-label">Orbit Radius</div>
            <div className="mt-2 text-white/82">{selectedBody.orbitRadius.toFixed(1)}</div>
          </div>
          <div>
            <div className="section-label">Period</div>
            <div className="mt-2 text-white/82">{selectedBody.orbitPeriodDays} days</div>
          </div>
          <div>
            <div className="section-label">Objects</div>
            <div className="mt-2 text-white/82">{placedObjects.length} user stars</div>
          </div>
        </div>
      </div>
    </>
  );
}
