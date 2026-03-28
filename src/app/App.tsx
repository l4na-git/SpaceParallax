import { BottomControlBar } from '../components/layout/BottomControlBar';
import { Sidebar } from '../components/layout/Sidebar';
import { StatusCards } from '../components/layout/StatusCards';
import { TopNav } from '../components/layout/TopNav';
import { PerspectivePanel } from '../features/camera-control/components/PerspectivePanel';
import { AddObjectPanel } from '../features/object-creation/components/AddObjectPanel';
import { useGesturePlacement } from '../features/gesture-input/useGesturePlacement';
import { SimulationCanvas } from '../features/simulation/components/SimulationCanvas';
import { useFaceTracking } from '../features/tracking/useFaceTracking';
import { useAppStore } from '../store/useAppStore';

function TrackingBadge() {
  const tracking = useAppStore((state) => state.tracking);

  return (
    <div className="panel-soft absolute right-6 bottom-6 z-30 rounded-sm px-4 py-3 text-xs">
      <div className="section-label">Tracking Status</div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            tracking.status === 'active' ? 'bg-emerald-400' : tracking.status === 'requesting' ? 'bg-amber-300' : 'bg-cyan-300'
          }`}
        />
        <span>{tracking.status.toUpperCase()}</span>
      </div>
      <div className="mt-1 text-white/55">{tracking.message}</div>
    </div>
  );
}

export function App() {
  useFaceTracking();
  useGesturePlacement();

  return (
    <div className="grid-bg relative h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(21,231,255,0.08),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.32)_100%)]" />

      <TopNav />

      <div className="relative z-10 flex h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="relative flex-1 overflow-hidden">
          <SimulationCanvas />
          <StatusCards />
          <PerspectivePanel />
          <AddObjectPanel />
          <BottomControlBar />
          <TrackingBadge />
        </main>
      </div>
    </div>
  );
}
