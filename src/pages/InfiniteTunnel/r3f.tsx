import React, { useRef } from 'react';
import { BackSide, Clock, Mesh, MeshBasicMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import storm from './storm.png';
import styles from './index.less';

const clock = new Clock();

const Scene: React.FC = () => {
  const texture = useTexture(storm, t => {
    t.colorSpace = SRGBColorSpace;
    t.wrapT = RepeatWrapping;
    t.repeat.set(1, 2);
  });
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const hRef = useRef<number>(0);

  useFrame(() => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const delta = clock.getDelta();
    hRef.current += 0.002;
    if (hRef.current > 1) {
      hRef.current = 0;
    }
    material.color.setHSL(hRef.current, 0.5, 0.5);
    material.alphaMap?.offset.setY(material.alphaMap.offset.y + delta * 0.5);
    mesh.rotation.y += delta * 0.5;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[30, 50, 1000, 32, 32, true]} />
        <meshBasicMaterial ref={materialRef} transparent alphaMap={texture} side={BackSide} />
      </mesh>
      <OrbitControls enableDamping={false} />
    </>
  );
}

const InfiniteTunnel: React.FC = () => {
  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 1000,
          position: [0.9, -520, 6.5],
        }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default InfiniteTunnel;
