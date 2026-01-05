import React, { useEffect, useRef, useState } from 'react';
import { BoxGeometry, Line, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Select } from 'antd';
import diqiu from './diqiu.jpg';
import zhuan from './zhuan.jpg';
import styles from './index.less';

const LineDashed: React.FC = () => {
  const lineRef = useRef<Line>(null);

  useFrame(() => {
    lineRef.current?.computeLineDistances();
  });

  return (
    <line_ ref={lineRef}>
      <edgesGeometry args={[new BoxGeometry(100, 100, 100)]} />
      <lineDashedMaterial color='orange' dashSize={10} gapSize={10} />
    </line_>
  );
}

const Plane: React.FC = () => {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color='orange' transparent opacity={0.5} />
    </mesh>
  );
}

const Earth: React.FC = () => {
  const texture = useLoader(TextureLoader, diqiu);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[100]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

const Wall: React.FC = () => {
  const texture = useLoader(TextureLoader, zhuan);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.colorSpace = SRGBColorSpace;
  }, [texture]);

  return (
    <mesh>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial map={texture} aoMap={texture} />
    </mesh>
  );
}

const modelMap = {
  lineDashed: LineDashed,
  plane: Plane,
  earth: Earth,
  wall: Wall,
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
      <pointLight args={['#fff', 10000]} position={[80, 80, 80]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const MaterialTexture: React.FC = () => {
  const [modelType, setModelType] = useState<ModelType>('lineDashed');

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
      >
        <Scene meshType={modelType} />
      </Canvas>
      <Select<ModelType>
        className={styles.select}
        options={[
          { label: '虚线材质', value: 'lineDashed' },
          { label: '平面', value: 'plane' },
          { label: '地球', value: 'earth' },
          { label: '墙', value: 'wall' },
        ]}
        value={modelType}
        onChange={setModelType}
      />
    </div>
  );
}

export default MaterialTexture;
