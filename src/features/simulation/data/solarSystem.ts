export type BodyKind = 'star' | 'planet' | 'user';

export interface CelestialBody {
  id: string;
  name: string;
  kind: BodyKind;
  radius: number;
  color: string;
  orbitRadius: number;
  orbitPeriodDays: number;
  mass: number;
  initialPhase: number;
  accentColor?: string;
}

export interface OrbitTarget {
  id: string;
  label: string;
  orbitRadius: number;
  orbitPeriodDays: number;
}

export const baseBodies: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Helios',
    kind: 'star',
    radius: 2.5,
    color: '#fff1a8',
    orbitRadius: 0,
    orbitPeriodDays: 1,
    mass: 1989000,
    initialPhase: 0,
    accentColor: '#ffd86b',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    kind: 'planet',
    radius: 0.32,
    color: '#ccc5bb',
    orbitRadius: 6,
    orbitPeriodDays: 88,
    mass: 0.33,
    initialPhase: 0.8,
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: 'planet',
    radius: 0.52,
    color: '#d7c18b',
    orbitRadius: 9,
    orbitPeriodDays: 225,
    mass: 4.87,
    initialPhase: 1.9,
  },
  {
    id: 'earth',
    name: 'Earth',
    kind: 'planet',
    radius: 0.56,
    color: '#76a8ff',
    orbitRadius: 13,
    orbitPeriodDays: 365,
    mass: 5.97,
    initialPhase: 0.2,
  },
  {
    id: 'mars',
    name: 'Mars',
    kind: 'planet',
    radius: 0.41,
    color: '#d56b28',
    orbitRadius: 17,
    orbitPeriodDays: 687,
    mass: 0.642,
    initialPhase: 2.4,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: 'planet',
    radius: 1.2,
    color: '#c69b72',
    orbitRadius: 24,
    orbitPeriodDays: 4333,
    mass: 1898,
    initialPhase: 1.3,
  },
];

export const orbitTargets: OrbitTarget[] = baseBodies
  .filter((body) => body.kind === 'planet')
  .map((body) => ({
    id: body.id,
    label: `${body.name} Orbit`,
    orbitRadius: body.orbitRadius,
    orbitPeriodDays: body.orbitPeriodDays,
  }));
