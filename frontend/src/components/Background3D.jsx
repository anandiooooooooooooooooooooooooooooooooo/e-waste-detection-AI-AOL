import { PointMaterial, Points } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DebrisField(props) {
  const ref = useRef();

  // E-Waste Color Palette
  const palette = [
    new THREE.Color('#10b981'), // PCB Green
    new THREE.Color('#059669'), // Darker Green
    new THREE.Color('#d97706'), // Gold/Amber
    new THREE.Color('#b45309'), // Copper/Rust
    new THREE.Color('#94a3b8'), // Silicon Grey
    new THREE.Color('#64748b'), // Dark Grey
    new THREE.Color('#e2e8f0'), // White/Plastic
  ];

  // Generate random positions and colors for particles
  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // Broad distribution
        const r = 4; // Spread out more
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x + (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 1.5;

        // Pick random color from palette
        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 50;
    ref.current.rotation.y -= delta / 60;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          vertexColors
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#f1f0ec]">
        <Canvas camera={{ position: [0, 0, 1] }}>
            <DebrisField />
        </Canvas>
    </div>
  );
}
