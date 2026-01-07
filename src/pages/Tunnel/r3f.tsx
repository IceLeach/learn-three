import React, { useEffect, useMemo, useRef } from 'react';
import { CatmullRomCurve3, DoubleSide, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import stone from './stone.png';
import styles from './index.less';

const path = new CatmullRomCurve3([
  new Vector3(-100, 20, 90),
  new Vector3(-40, 80, 100),
  new Vector3(0, 0, 0),
  new Vector3(60, -60, 0),
  new Vector3(100, -40, 80),
  new Vector3(150, 60, 60),
]);

const Scene: React.FC = () => {
  const texture = useTexture(stone, t => {
    t.wrapS = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.repeat.x = 20;
  });
  const pointIndexRef = useRef<number>(0);

  const points = useMemo(() => {
    return path.getSpacedPoints(1000);
  }, [path]);

  useFrame(({ camera }) => {
    const pointIndex = pointIndexRef.current;
    if (pointIndex < points.length - 1) {
      camera.position.copy(points[pointIndex]);
      camera.lookAt(points[pointIndex + 1]);
    } else {
      pointIndexRef.current = 0;
    }
  });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        pointIndexRef.current += 10;
      }
    }
    document.addEventListener('keydown', fn);

    return () => {
      document.removeEventListener('keydown', fn);
    }
  }, []);

  return (
    <>
      <mesh>
        <tubeGeometry args={[path, 100, 5, 30]} />
        <meshBasicMaterial map={texture} aoMap={texture} side={DoubleSide} />
      </mesh>
      <pointLight args={['#fff', 200]} position={[80, 80, 80]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Tunnel: React.FC = () => {
  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 10000,
          position: [200, 200, 200],
        }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default Tunnel;
