import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Select } from 'antd';
import styles from './index.less';

const Triangle: React.FC = () => {
  return (
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
  );
}

const Plane: React.FC = () => {
  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            100, 100, 0,
          ]), 3]}
        />
        <bufferAttribute
          attach='index'
          args={[new Uint16Array([0, 1, 2, 2, 1, 3]), 1]}
        />
      </bufferGeometry>
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  );
}

const Plane2: React.FC = () => {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  );
}

const Box: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[100, 100, 100]} />
      <meshBasicMaterial color='orange' wireframe />
    </mesh>
  );
}

const meshMap = {
  triangle: Triangle,
  plane: Plane,
  plane2: Plane2,
  box: Box,
} satisfies Record<string, React.ComponentType>;

type MeshType = keyof typeof meshMap;

interface SceneProps {
  meshType: MeshType;
}

const Scene: React.FC<SceneProps> = (props) => {
  const { meshType } = props;
  const MeshComponent = meshMap[meshType];

  return (
    <>
      <MeshComponent />
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
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Scene meshType={meshType} />
      </Canvas>
      <Select<MeshType>
        className={styles.select}
        options={[
          { label: '三角形', value: 'triangle' },
          { label: '平面', value: 'plane' },
          { label: '平面2', value: 'plane2' },
          { label: '立方体', value: 'box' },
        ]}
        value={meshType}
        onChange={setMeshType}
      />
    </div>
  );
}

export default Vertice;
