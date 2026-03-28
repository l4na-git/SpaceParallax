import { userStarTemplates } from '../templates';
import { useAppStore } from '../../../store/useAppStore';

export function AddObjectPanel() {
  const addObjectPanelOpen = useAppStore((state) => state.ui.addObjectPanelOpen);
  const templates = useAppStore((state) => state.catalog.templates);
  const selectedTemplateId = useAppStore((state) => state.catalog.selectedTemplateId);
  const selectedOrbitTargetId = useAppStore((state) => state.catalog.selectedOrbitTargetId);
  const pendingMass = useAppStore((state) => state.catalog.pendingMass);
  const orbitTargets = useAppStore((state) => state.simulation.orbitTargets);
  const setSelectedTemplate = useAppStore((state) => state.setSelectedTemplate);
  const setSelectedOrbitTarget = useAppStore((state) => state.setSelectedOrbitTarget);
  const setPendingMass = useAppStore((state) => state.setPendingMass);
  const addObjectToOrbit = useAppStore((state) => state.addObjectToOrbit);
  const setAddObjectPanelOpen = useAppStore((state) => state.setAddObjectPanelOpen);

  const template = templates.find((entry) => entry.id === selectedTemplateId) ?? userStarTemplates[0];

  return (
    <aside
      className={`panel-soft absolute top-12 right-20 z-40 h-[min(78vh,720px)] w-[min(34vw,380px)] min-w-[320px] overflow-hidden transition duration-300 ${
        addObjectPanelOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
      }`}
    >
      <div className="h-full border border-cyan-400/8 bg-[#14171b]/95 px-6 py-6">
        <div className="section-label">Initialization Sequence</div>
        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Add New Celestial Body</h2>
          <button className="text-white/50 hover:text-white" onClick={() => setAddObjectPanelOpen(false)}>
            ✕
          </button>
        </div>

        <div className="mt-8">
          <div className="section-label">Template Selection</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {templates.map((entry) => {
              const active = entry.id === selectedTemplateId;
              return (
                <button
                  key={entry.id}
                  className={`rounded-sm border px-4 py-4 text-left ${
                    active
                      ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_26px_rgba(21,231,255,0.12)]'
                      : 'border-white/6 bg-white/[0.04] text-white/72'
                  }`}
                  onClick={() => setSelectedTemplate(entry.id)}
                >
                  <div className="mb-3 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <div className="font-medium">{entry.label}</div>
                  <div className="mt-1 text-xs text-white/45">{entry.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <div className="section-label">Orbit Destination</div>
            <select
              className="mt-3 w-full rounded-sm border border-white/10 bg-black/20 px-3 py-3 text-white outline-none"
              onChange={(event) => setSelectedOrbitTarget(event.target.value)}
              value={selectedOrbitTargetId}
            >
              {orbitTargets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="section-label">Mass Parameter (M+)</span>
              <span className="accent-text font-semibold">{pendingMass.toFixed(1)}</span>
            </div>
            <input
              className="range-accent w-full"
              max={template.maxMass}
              min={template.minMass}
              onChange={(event) => setPendingMass(Number(event.target.value))}
              step={1}
              type="range"
              value={pendingMass}
            />
            <div className="mt-2 flex justify-between text-[10px] text-white/35">
              <span>{template.minMass.toFixed(1)}</span>
              <span>{template.maxMass.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-sm border border-cyan-300/10 bg-white/[0.03] px-4 py-4">
            <div className="section-label">Deployment Route</div>
            <div className="mt-2 font-semibold">{template.label}</div>
            <div className="mt-1 text-sm text-white/60">
              UI is the primary route. Gesture placement calls this same deployment pipeline.
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            className="headline-mono flex-1 rounded-sm border border-cyan-300/80 bg-cyan-300/92 px-4 py-4 text-sm font-semibold tracking-[0.22em] text-black"
            onClick={() =>
              addObjectToOrbit({
                templateId: selectedTemplateId,
                orbitTargetId: selectedOrbitTargetId,
                mass: pendingMass,
              })
            }
          >
            Deploy Into Orbit
          </button>
        </div>

        <button
          className="mt-3 w-full text-center text-[10px] tracking-[0.24em] text-white/35"
          onClick={() => setAddObjectPanelOpen(false)}
        >
          DISCARD SEQUENCE
        </button>
      </div>
    </aside>
  );
}
