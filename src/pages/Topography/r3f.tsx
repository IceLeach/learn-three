import React, { useEffect, useRef } from 'react';
import { Mesh } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { createNoise2D } from 'simplex-noise';
import styles from './index.less';

const noise2D = createNoise2D();
const noiseZ = (x: number, y: number) => {
  return noise2D(x / 300, y / 300) * 50;
}

const Scene: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  const updatePosition = (mesh: Mesh) => {
    const geometry = mesh.geometry;
    const positions = geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = noiseZ(x, y);
      const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;
      positions.setZ(i, z + sinNum);
    }
    positions.needsUpdate = true;
  }

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    updatePosition(mesh);
    mesh.rotateZ(0.001);
  });

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const geometry = mesh.geometry;
      const positions = geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = noiseZ(x, y);
        positions.setZ(i, z);
      }
      mesh.rotateX(Math.PI / 2);
    }
  }, []);

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[3000, 3000, 100, 100]} />
        <meshBasicMaterial color='orange' wireframe />
      </mesh>
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Topography: React.FC = () => {
  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 10000,
          position: [400, 150, 100],
        }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default Topography;
