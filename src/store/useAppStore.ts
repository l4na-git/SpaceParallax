import { create } from 'zustand';

import {
  baseBodies,
  orbitTargets,
  type CelestialBody,
  type OrbitTarget,
} from '../features/simulation/data/solarSystem';
import {
  userStarTemplates,
  type UserStarTemplate,
} from '../features/object-creation/templates';

export interface PlacedObject extends CelestialBody {
  templateId: string;
  orbitTargetId: string;
  createdAt: number;
}

export interface AddObjectPayload {
  templateId: string;
  orbitTargetId: string;
  mass: number;
}

export type TrackingStatus = 'idle' | 'requesting' | 'active' | 'fallback' | 'error';

export interface TrackingState {
  status: TrackingStatus;
  mode: 'ui' | 'face';
  enabled: boolean;
  supported: boolean;
  message: string;
  offsetX: number;
  offsetY: number;
}

export interface CameraControlState {
  horizontalOffset: number;
  verticalOffset: number;
  depth: number;
  trackingBlend: number;
}

export interface SimulationSettings {
  paused: boolean;
  speedMultiplier: number;
}

interface AppState {
  simulation: {
    baseBodies: CelestialBody[];
    placedObjects: PlacedObject[];
    settings: SimulationSettings;
    orbitTargets: OrbitTarget[];
    selectedBodyId: string | null;
  };
  catalog: {
    templates: UserStarTemplate[];
    selectedTemplateId: string;
    selectedOrbitTargetId: string;
    pendingMass: number;
  };
  cameraControl: CameraControlState;
  tracking: TrackingState;
  ui: {
    addObjectPanelOpen: boolean;
    activeSection: 'simulation' | 'telemetry' | 'orbits' | 'archives';
    perspectiveMode: '3D_DEEP_FIELD' | 'FOCUS_TRACK';
  };
  addObjectToOrbit: (payload: AddObjectPayload) => void;
  setSelectedTemplate: (templateId: string) => void;
  setSelectedOrbitTarget: (orbitTargetId: string) => void;
  setPendingMass: (mass: number) => void;
  setAddObjectPanelOpen: (open: boolean) => void;
  setSpeedMultiplier: (speedMultiplier: number) => void;
  togglePaused: () => void;
  setSelectedBodyId: (bodyId: string | null) => void;
  setCameraControl: (partial: Partial<CameraControlState>) => void;
  setTrackingEnabled: (enabled: boolean) => void;
  setTrackingStatus: (tracking: Partial<TrackingState>) => void;
  setActiveSection: (section: AppState['ui']['activeSection']) => void;
  setPerspectiveMode: (mode: AppState['ui']['perspectiveMode']) => void;
}

const defaultTemplate = userStarTemplates[1];
const defaultOrbitTarget = orbitTargets[2];

export const useAppStore = create<AppState>((set, get) => ({
  simulation: {
    baseBodies,
    placedObjects: [
      {
        id: 'obj-sol-station',
        name: 'Sol Station',
        kind: 'user',
        templateId: 'small-star',
        orbitTargetId: 'earth',
        radius: 0.9,
        color: '#ecfdff',
        accentColor: '#15e7ff',
        orbitRadius: 13,
        orbitPeriodDays: 365,
        mass: 182,
        initialPhase: 1.18,
        createdAt: Date.now() - 3600,
      },
      {
        id: 'obj-jupiter-relay',
        name: 'Jupiter Relay',
        kind: 'user',
        templateId: 'satellite',
        orbitTargetId: 'jupiter',
        radius: 0.36,
        color: '#e6d7a3',
        accentColor: '#ffe4a0',
        orbitRadius: 24,
        orbitPeriodDays: 4333,
        mass: 12,
        initialPhase: 0.48,
        createdAt: Date.now() - 1800,
      },
    ],
    settings: {
      paused: false,
      speedMultiplier: 10,
    },
    orbitTargets,
    selectedBodyId: 'earth',
  },
  catalog: {
    templates: userStarTemplates,
    selectedTemplateId: defaultTemplate.id,
    selectedOrbitTargetId: defaultOrbitTarget.id,
    pendingMass: defaultTemplate.defaultMass,
  },
  cameraControl: {
    horizontalOffset: 0,
    verticalOffset: 0,
    depth: 38,
    trackingBlend: 0.65,
  },
  tracking: {
    status: 'fallback',
    mode: 'ui',
    enabled: false,
    supported: false,
    message: 'UI control active',
    offsetX: 0,
    offsetY: 0,
  },
  ui: {
    addObjectPanelOpen: false,
    activeSection: 'simulation',
    perspectiveMode: '3D_DEEP_FIELD',
  },
  addObjectToOrbit: ({ mass, orbitTargetId, templateId }) => {
    const template = get().catalog.templates.find((entry) => entry.id === templateId);
    const target = get().simulation.orbitTargets.find((entry) => entry.id === orbitTargetId);
    if (!template || !target) {
      return;
    }

    const now = Date.now();
    const newObject: PlacedObject = {
      id: `obj-${crypto.randomUUID()}`,
      name: `${template.label.toUpperCase().replace(/\s+/g, '-')}-${get().simulation.placedObjects.length + 1}`,
      kind: 'user',
      templateId,
      orbitTargetId,
      radius: template.radius,
      color: template.color,
      accentColor: template.glow,
      orbitRadius: target.orbitRadius,
      orbitPeriodDays: target.orbitPeriodDays,
      mass,
      initialPhase: ((now / 1000) % Math.PI) + Math.random() * 0.8,
      createdAt: now,
    };

    set((state) => ({
      simulation: {
        ...state.simulation,
        placedObjects: [...state.simulation.placedObjects, newObject],
        selectedBodyId: newObject.id,
      },
      ui: {
        ...state.ui,
        addObjectPanelOpen: false,
      },
    }));
  },
  setSelectedTemplate: (templateId) =>
    set((state) => {
      const template = state.catalog.templates.find((entry) => entry.id === templateId);
      if (!template) {
        return state;
      }

      return {
        catalog: {
          ...state.catalog,
          selectedTemplateId: templateId,
          pendingMass: template.defaultMass,
        },
      };
    }),
  setSelectedOrbitTarget: (orbitTargetId) =>
    set((state) => ({
      catalog: {
        ...state.catalog,
        selectedOrbitTargetId: orbitTargetId,
      },
    })),
  setPendingMass: (mass) =>
    set((state) => ({
      catalog: {
        ...state.catalog,
        pendingMass: mass,
      },
    })),
  setAddObjectPanelOpen: (open) =>
    set((state) => ({
      ui: {
        ...state.ui,
        addObjectPanelOpen: open,
      },
    })),
  setSpeedMultiplier: (speedMultiplier) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        settings: {
          ...state.simulation.settings,
          speedMultiplier,
        },
      },
    })),
  togglePaused: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        settings: {
          ...state.simulation.settings,
          paused: !state.simulation.settings.paused,
        },
      },
    })),
  setSelectedBodyId: (bodyId) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        selectedBodyId: bodyId,
      },
    })),
  setCameraControl: (partial) =>
    set((state) => ({
      cameraControl: {
        ...state.cameraControl,
        ...partial,
      },
    })),
  setTrackingEnabled: (enabled) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        enabled,
        mode: enabled ? state.tracking.mode : 'ui',
        status: enabled ? 'requesting' : 'fallback',
        message: enabled ? 'Booting camera input…' : 'UI control active',
      },
    })),
  setTrackingStatus: (tracking) =>
    set((state) => ({
      tracking: {
        ...state.tracking,
        ...tracking,
      },
    })),
  setActiveSection: (section) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeSection: section,
      },
    })),
  setPerspectiveMode: (mode) =>
    set((state) => ({
      ui: {
        ...state.ui,
        perspectiveMode: mode,
      },
    })),
}));
