import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './index.less';

const Cube: React.FC = () => {
  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 1000,
          position: [200, 200, 200],
        }}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[100, 100, 100]} />
          <meshLambertMaterial color='orange' />
        </mesh>
        <axesHelper args={[200]} />
        <pointLight args={['#fff', 10000]} position={[80, 80, 80]} />
        <OrbitControls enableDamping={false} />
      </Canvas>
    </div>
  );
}

export default Cube;
