import React, { useEffect } from 'react';
import * as THREE from 'three';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './index.less';

type MeshType = THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap>;

interface GuiProps {
  meshRef: React.RefObject<MeshType>;
  pointLightRef: React.RefObject<THREE.PointLight>;
}

const Gui: React.FC<GuiProps> = (props) => {
  const { meshRef, pointLightRef } = props;

  const createGui = () => {
    const mesh = meshRef.current;
    const pointLight = pointLightRef.current;
    if (!mesh || !pointLight) return;
    const gui = new GUI();
    const meshFolder = gui.addFolder('立方体');
    meshFolder.addColor(mesh.material, 'color');
    meshFolder.add(mesh.position, 'x').step(10);
    meshFolder.add(mesh.position, 'y').step(10);
    meshFolder.add(mesh.position, 'z').step(10);
    const lightFolder = gui.addFolder('灯光');
    lightFolder.add(pointLight.position, 'x').step(10);
    lightFolder.add(pointLight.position, 'y').step(10);
    lightFolder.add(pointLight.position, 'z').step(10);
    lightFolder.add(pointLight, 'intensity').step(1000);
  }

  useEffect(() => {
    createGui();
  }, []);

  return null;
}

const Scene: React.FC = () => {
  const { camera } = useThree();
  const meshRef = React.useRef<MeshType>(null);
  const pointLightRef = React.useRef<THREE.PointLight>(null);

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[100, 100, 100]} />
        <meshLambertMaterial color='orange' />
      </mesh>
      <axesHelper args={[200]} />
      <pointLight ref={pointLightRef} args={['#fff', 10000]} position={[80, 80, 80]} />
      <OrbitControls enableDamping={false} />
      <Gui meshRef={meshRef} pointLightRef={pointLightRef} />
    </>
  );
}

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
        <Scene />
      </Canvas>
    </div>
  );
}

export default Cube;
