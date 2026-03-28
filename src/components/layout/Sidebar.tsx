import { useAppStore } from '../../store/useAppStore';

const sections = [
  { id: 'simulation', label: 'Planetary Data' },
  { id: 'telemetry', label: 'Orbital Dynamics' },
  { id: 'orbits', label: 'Mass Analytics' },
  { id: 'archives', label: 'System Logs' },
] as const;

export function Sidebar() {
  const activeSection = useAppStore((state) => state.ui.activeSection);
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setAddObjectPanelOpen = useAppStore((state) => state.setAddObjectPanelOpen);

  return (
    <aside className="panel-soft relative z-20 flex h-full w-[220px] flex-col border-r border-white/5 bg-black/20 px-5 py-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg border border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_20px_rgba(21,231,255,0.16)]" />
          <div>
            <div className="headline-mono text-sm font-bold">HELIOS_SYSTEM</div>
            <div className="mt-1 text-[10px] tracking-[0.22em] text-cyan-300/70">COORD: 0,0,0_LVL_1</div>
          </div>
        </div>

        <nav className="mt-10 space-y-3">
          {sections.map((section) => {
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                className={`flex w-full items-center justify-between border-l-2 px-4 py-4 text-left transition ${
                  active
                    ? 'border-cyan-300 bg-cyan-300/12 text-cyan-100'
                    : 'border-transparent text-white/45 hover:text-white/72'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        className="headline-mono mt-10 rounded-sm border border-cyan-300/80 bg-cyan-300 px-4 py-4 text-[13px] tracking-[0.24em] text-black shadow-[0_0_25px_rgba(21,231,255,0.2)]"
        onClick={() => setAddObjectPanelOpen(true)}
      >
        Add_Object
      </button>

      <div className="mt-auto space-y-6 text-white/32">
        <div>Diagnostic</div>
        <div>Emergency_Stop</div>
      </div>
    </aside>
  );
}
