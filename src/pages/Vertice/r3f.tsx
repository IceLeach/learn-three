import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Select } from 'antd';
import styles from './index.less';

const meshMap = {
  triangle: (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            0, 0, 10,
            0, 0, 100,
            100, 0, 10,
          ]), 3]}
        />
      </bufferGeometry>
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  ),
  plane: (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            0, 100, 0,
            100, 0, 0,
            100, 100, 0,
          ]), 3]}
        />
      </bufferGeometry>
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  ),
  planeGeometry: (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  ),
  boxGeometry: (
    <mesh>
      <boxGeometry args={[100, 100, 100]} />
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  ),
} satisfies Record<string, React.ReactNode>;

type MeshType = keyof typeof meshMap;

interface SceneProps {
  meshType: MeshType;
}

const Scene: React.FC<SceneProps> = (props) => {
  const { meshType } = props;
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {meshMap[meshType]}
      <axesHelper args={[200]} />
      <pointLight args={['#fff', 10000]} position={[80, 80, 80]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Vertice: React.FC = () => {
  const [meshType, setMeshType] = useState<MeshType>('triangle');

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
        <Scene meshType={meshType} />
      </Canvas>
      <Select<MeshType>
        className={styles.select}
        options={[
          { label: '三角形', value: 'triangle' },
          { label: '平面', value: 'plane' },
          { label: 'PlaneGeometry', value: 'planeGeometry' },
          { label: 'BoxGeometry', value: 'boxGeometry' },
        ]}
        value={meshType}
        onChange={setMeshType}
      />
    </div>
  );
}

export default Vertice;
