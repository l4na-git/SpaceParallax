import { useAppStore } from '../../store/useAppStore';

const tabs = ['Simulation', 'Telemetry', 'Orbits', 'Archives'] as const;

export function TopNav() {
  const activeSection = useAppStore((state) => state.ui.activeSection);
  const setActiveSection = useAppStore((state) => state.setActiveSection);

  return (
    <header className="panel-soft relative z-20 flex h-16 items-center justify-between border-b border-white/5 px-6">
      <div className="flex items-center gap-8">
        <div className="headline-mono text-3xl font-bold accent-text">SOLARIS_OS</div>
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const id = tab.toLowerCase() as typeof activeSection;
            const active = activeSection === id;
            return (
              <button
                key={tab}
                className={`headline-mono border-b px-1 py-4 text-[11px] tracking-[0.24em] ${
                  active ? 'border-cyan-300 text-cyan-100' : 'border-transparent text-white/42'
                }`}
                onClick={() => setActiveSection(id)}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 text-white/70">
        <span>⚙</span>
        <span>◼</span>
        <span>?</span>
      </div>
    </header>
  );
}
