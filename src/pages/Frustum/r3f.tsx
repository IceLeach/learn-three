import React, { useEffect, useRef } from 'react';
import { CameraHelper, PerspectiveCamera } from 'three';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { Canvas, useThree } from '@react-three/fiber';
import { Helper, OrbitControls } from '@react-three/drei';
import styles from './index.less';

interface GuiProps {
  cameraRef: React.RefObject<PerspectiveCamera>;
}

const Gui: React.FC<GuiProps> = (props) => {
  const { cameraRef } = props;

  const createGui = () => {
    const camera = cameraRef.current;
    if (!camera) return;
    const gui = new GUI();
    const onChange = () => {
      camera.updateProjectionMatrix();
    }
    gui.add(camera, 'fov', [30, 60, 10]).onChange(onChange);
    gui.add(camera, 'aspect', { '16:9': 16 / 9, '4:3': 4 / 3 }).onChange(onChange);
    gui.add(camera, 'near', 0, 300).onChange(onChange);
    gui.add(camera, 'far', 300, 800).onChange(onChange);
    return gui;
  }

  useEffect(() => {
    const gui = createGui();

    return () => {
      gui?.destroy();
    };
  }, []);

  return null;
}

const Scene: React.FC = () => {
  const { camera } = useThree();
  const cameraRef = useRef<PerspectiveCamera>(null);

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <OrbitControls enableDamping={false} />
      <perspectiveCamera ref={cameraRef} args={[20, 16 / 9, 100, 300]}>
        <Helper type={CameraHelper} />
      </perspectiveCamera>
      <Gui cameraRef={cameraRef} />
    </>
  );
}

const Frustum: React.FC = () => {
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

export default Frustum;
