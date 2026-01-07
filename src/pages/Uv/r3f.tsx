import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import { MeshBasicMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import bg from './bg.png';
import muxing from './muxing.jpg';
import styles from './index.less';

const Coordinate: React.FC = () => {
  const texture = useTexture(bg, t => t.colorSpace = SRGBColorSpace);

  return (
    <mesh>
      <planeGeometry args={[200, 100]}>
        <bufferAttribute
          attach='attributes-uv'
          args={[new Float32Array([
            0, 0.5,
            0.5, 0.5,
            0, 0,
            0.5, 0,
          ]), 2]}
        />
      </planeGeometry>
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

const Animation: React.FC = () => {
  const texture = useTexture(muxing, t => {
    t.colorSpace = SRGBColorSpace;
    t.wrapT = RepeatWrapping;
  });
  const materialRef = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    materialRef.current?.map?.offset.setY(materialRef.current.map.offset.y + 0.01);
  });

  return (
    <mesh>
      <sphereGeometry args={[50]} />
      <meshBasicMaterial ref={materialRef} map={texture} />
    </mesh>
  );
}

const meshMap = {
  coordinate: Coordinate,
  animation: Animation,
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
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Uv: React.FC = () => {
  const [meshType, setMeshType] = useState<MeshType>('coordinate');

  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 1000,
          position: [0, 0, 200],
        }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Scene meshType={meshType} />
      </Canvas>
      <Select<MeshType>
        className={styles.select}
        options={[
          { label: 'uv 坐标', value: 'coordinate' },
          { label: 'uv 动画', value: 'animation' },
        ]}
        value={meshType}
        onChange={setMeshType}
      />
    </div>
  );
}

export default Uv;
