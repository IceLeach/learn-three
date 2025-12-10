import React, { useEffect, useRef, useState } from 'react';
import { BufferAttribute, BufferGeometry, DoubleSide } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Select } from 'antd';
import styles from './index.less';

const Point: React.FC = () => {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            0, 0, 100,
            100, 100, 0,
          ]), 3]}
        />
      </bufferGeometry>
      <pointsMaterial color='orange' size={10} />
    </points>
  );
}

const Line: React.FC = () => {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            0, 0, 100,
            100, 100, 0,
          ]), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color='orange' />
    </line>
  );
}

const Mesh: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    const geometry = geometryRef.current;
    const indexes = new Uint16Array([0, 1, 2, 2, 1, 3]);
    if (geometry) {
      geometry.index = new BufferAttribute(indexes, 1);
    }
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array([
            0, 0, 0,
            100, 0, 0,
            0, 100, 0,
            100, 100, 0,
          ]), 3]}
        />
      </bufferGeometry>
      <meshBasicMaterial color='orange' side={DoubleSide} />
    </mesh>
  );
}

const Plane: React.FC = () => (
  <mesh>
    <planeGeometry args={[100, 100, 2, 3]} />
    <meshBasicMaterial color='orange' wireframe />
  </mesh>
);

const Cylinder: React.FC = () => (
  <mesh>
    <cylinderGeometry args={[50, 50, 80]} />
    <meshBasicMaterial color='orange' wireframe />
  </mesh>
);

const modelMap = {
  point: Point,
  line: Line,
  mesh: Mesh,
  plane: Plane,
  cylinder: Cylinder,
} satisfies Record<string, React.ComponentType>;

type ModelType = keyof typeof modelMap;

interface SceneProps {
  meshType: ModelType;
}

const Scene: React.FC<SceneProps> = (props) => {
  const { meshType } = props;
  const { camera } = useThree();
  const ModelComponent = modelMap[meshType];

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ModelComponent />
      <axesHelper args={[200]} />
      <pointLight args={['#fff', 10000]} position={[80, 80, 80]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Model: React.FC = () => {
  const [modelType, setModelType] = useState<ModelType>('point');

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
        <Scene meshType={modelType} />
      </Canvas>
      <Select<ModelType>
        className={styles.select}
        options={[
          { label: '点模型', value: 'point' },
          { label: '线模型', value: 'line' },
          { label: '网格模型', value: 'mesh' },
          { label: '平面', value: 'plane' },
          { label: '圆柱体', value: 'cylinder' },
        ]}
        value={modelType}
        onChange={setModelType}
      />
    </div>
  );
}

export default Model;
