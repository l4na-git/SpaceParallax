export interface UserStarTemplate {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  glow: string;
  defaultMass: number;
  minMass: number;
  maxMass: number;
  radius: number;
}

export const userStarTemplates: UserStarTemplate[] = [
  {
    id: 'small-star',
    label: 'Small Star',
    subtitle: 'Core: Hydrogen',
    color: '#11ebff',
    glow: '#57f3ff',
    defaultMass: 160,
    minMass: 10,
    maxMass: 500,
    radius: 0.48,
  },
  {
    id: 'gas-giant',
    label: 'Gas Giant',
    subtitle: 'Core: Metallic H',
    color: '#47d0ff',
    glow: '#84e4ff',
    defaultMass: 318,
    minMass: 80,
    maxMass: 1200,
    radius: 0.78,
  },
  {
    id: 'rocky-planet',
    label: 'Rocky Planet',
    subtitle: 'Silicate Crust',
    color: '#f06e3e',
    glow: '#ff9c6b',
    defaultMass: 52,
    minMass: 4,
    maxMass: 240,
    radius: 0.38,
  },
  {
    id: 'satellite',
    label: 'Satellite',
    subtitle: 'Orbital Relay',
    color: '#ffe19a',
    glow: '#ffe9bb',
    defaultMass: 12,
    minMass: 1,
    maxMass: 60,
    radius: 0.22,
  },
];
