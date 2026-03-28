# SpaceParallax

SpaceParallax is a browser-based solar system experience built with React, TypeScript, Vite, Three.js, `@react-three/fiber`, Zustand, Tailwind CSS, and optional MediaPipe input extensions.

## Runtime

- Recommended Node.js: `24.14.1`
- React: `19.2.4`
- React DOM: `19.2.4`
- `@react-three/fiber`: `9.4.2`
- `three`: `0.183.2`

`three@0.183.2` is pinned exactly in `package.json` to stay aligned with `@react-three/fiber@9.4.2` and its `peerDependencies` requirement of `three >= 0.156`.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## MVP behavior

- UI is the primary control path.
- Solar system rendering, object creation, and camera parallax all work without MediaPipe.
- Face tracking is an optional extension and only affects left/right and up/down camera offsets in the first version.
- Gesture placement is also optional and calls the same `addObjectToOrbit(payload)` flow used by the UI.
