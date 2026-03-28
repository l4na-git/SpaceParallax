import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useAppStore } from '../../../store/useAppStore';
import { useSimulationClock } from '../hooks/useSimulationClock';
import type { CelestialBody } from '../data/solarSystem';

function OrbitRing({ radius }: { radius: number }) {
  const orbitLine = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(120).map((point: THREE.Vector2) => new THREE.Vector3(point.x, 0, point.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: '#dce4ea',
      opacity: 0.14,
      transparent: true,
    });
    return new THREE.Line(geometry, material);
  }, [radius]);

  return <primitive object={orbitLine} rotation={[-Math.PI / 2, 0, 0]} />;
}

function Starfield() {
  const positions = useMemo(() => {
    const buffer = new Float32Array(900);
    for (let index = 0; index < buffer.length; index += 3) {
      buffer[index] = (Math.random() - 0.5) * 160;
      buffer[index + 1] = (Math.random() - 0.5) * 120;
      buffer[index + 2] = (Math.random() - 0.5) * 160;
    }
    return buffer;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#c6f8ff" size={0.14} sizeAttenuation transparent opacity={0.86} />
    </points>
  );
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const cameraControl = useAppStore((state) => state.cameraControl);
  const tracking = useAppStore((state) => state.tracking);
  const targetVector = useRef(new THREE.Vector3());
  const smoothedTrackingX = useRef(0);
  const smoothedTrackingY = useRef(0);

  useFrame((_, delta) => {
    const blend = tracking.enabled ? cameraControl.trackingBlend : 0;
    const desiredTrackingX = tracking.status === 'active' ? tracking.offsetX * 12 * blend : 0;
    const desiredTrackingY = tracking.status === 'active' ? tracking.offsetY * 16 * blend : 0;
    const trackingDamping = tracking.status === 'active' ? 4.2 : 1.6;
    smoothedTrackingX.current = THREE.MathUtils.lerp(
      smoothedTrackingX.current,
      desiredTrackingX,
      1 - Math.exp(-delta * trackingDamping),
    );
    smoothedTrackingY.current = THREE.MathUtils.lerp(
      smoothedTrackingY.current,
      desiredTrackingY,
      1 - Math.exp(-delta * trackingDamping),
    );

    const targetX = cameraControl.horizontalOffset + smoothedTrackingX.current;
    const targetY = 8 + cameraControl.verticalOffset + smoothedTrackingY.current;
    const targetZ = cameraControl.depth;

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 1 - Math.exp(-delta * 2.6));
    targetVector.current.lerp(
      new THREE.Vector3(cameraControl.horizontalOffset * 0.18, cameraControl.verticalOffset * 0.08, 0),
      1 - Math.exp(-delta * 2),
    );
    camera.lookAt(targetVector.current);
  });

  return null;
}

function BodyMesh({
  body,
  position,
  selected,
}: {
  body: CelestialBody;
  position: THREE.Vector3;
  selected: boolean;
}) {
  const setSelectedBodyId = useAppStore((state) => state.setSelectedBodyId);

  return (
    <group position={position}>
      <mesh
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          setSelectedBodyId(body.id);
        }}
      >
        <sphereGeometry args={[body.radius, 32, 32]} />
        <meshStandardMaterial
          color={body.color}
          emissive={body.kind === 'star' ? body.color : body.accentColor ?? body.color}
          emissiveIntensity={body.kind === 'star' ? 2.2 : selected ? 0.55 : 0.28}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
      {(selected || body.kind === 'user') && (
        <>
          <pointLight color={body.accentColor ?? body.color} intensity={selected ? 18 : 7} distance={7} />
          <mesh position={[0, body.radius + 0.8, 0]}>
            <planeGeometry args={[4.5, 1.2]} />
            <meshBasicMaterial color="#000000" opacity={0} transparent />
          </mesh>
        </>
      )}
    </group>
  );
}

function PlanetSystem({
  body,
  simulatedDays,
  selectedBodyId,
}: {
  body: CelestialBody;
  simulatedDays: number;
  selectedBodyId: string | null;
}) {
  if (body.orbitRadius === 0) {
    return (
      <group>
        <BodyMesh body={body} position={new THREE.Vector3(0, 0, 0)} selected={selectedBodyId === body.id} />
        <pointLight color="#ffd87b" intensity={1200} distance={180} decay={2} />
      </group>
    );
  }

  const angle = (simulatedDays / body.orbitPeriodDays) * Math.PI * 2 + body.initialPhase;
  const position = new THREE.Vector3(
    Math.cos(angle) * body.orbitRadius,
    0,
    Math.sin(angle) * body.orbitRadius,
  );

  return (
    <group>
      <OrbitRing radius={body.orbitRadius} />
      <BodyMesh body={body} position={position} selected={selectedBodyId === body.id} />
    </group>
  );
}

export function SolarSystemScene({
  paused,
  speedMultiplier,
}: {
  paused: boolean;
  speedMultiplier: number;
}) {
  const simulatedDays = useSimulationClock(paused, speedMultiplier);
  const baseBodies = useAppStore((state) => state.simulation.baseBodies);
  const placedObjects = useAppStore((state) => state.simulation.placedObjects);
  const selectedBodyId = useAppStore((state) => state.simulation.selectedBodyId);
  const setSelectedBodyId = useAppStore((state) => state.setSelectedBodyId);

  const allBodies = useMemo(() => [...baseBodies, ...placedObjects], [baseBodies, placedObjects]);

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[0, 18, 20]} intensity={0.3} color="#9be9ff" />
      <Starfield />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[28, 80]} />
        <meshBasicMaterial color="#0b6772" transparent opacity={0.04} />
      </mesh>
      <group rotation={[-0.28, 0.28, 0]}>
        {allBodies.map((body) => (
          <PlanetSystem
            key={body.id}
            body={body}
            selectedBodyId={selectedBodyId}
            simulatedDays={simulatedDays}
          />
        ))}
      </group>
      <CameraRig />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.15, 0]}
        onClick={() => setSelectedBodyId(null)}
      >
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
