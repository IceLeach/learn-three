import React, { useEffect } from 'react';
import { CameraHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import styles from './index.less';

const Frustum: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const resetSize = (data: { renderer: WebGLRenderer, camera: PerspectiveCamera }) => {
    const { renderer, camera } = data;
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera }) => {
    const { renderer, scene, camera } = data;
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createGui = (data: { camera: PerspectiveCamera, cameraHelper: CameraHelper }) => {
    const { camera, cameraHelper } = data;
    const gui = new GUI();
    const onChange = () => {
      camera.updateProjectionMatrix();
      cameraHelper.update();
    }
    gui.add(camera, 'fov', [30, 60, 10]).onChange(onChange);
    gui.add(camera, 'aspect', { '16:9': 16 / 9, '4:3': 4 / 3 }).onChange(onChange);
    gui.add(camera, 'near', 0, 300).onChange(onChange);
    gui.add(camera, 'far', 300, 800).onChange(onChange);
    return gui;
  }

  const init = () => {
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ref.current?.appendChild(canvas);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    const camera2 = new PerspectiveCamera(20, 16 / 9, 100, 300);
    const cameraHelper = new CameraHelper(camera2);
    scene.add(cameraHelper);
    render({ renderer, scene, camera });
    const controls = new OrbitControls(camera, renderer.domElement);
    const gui = createGui({ camera: camera2, cameraHelper });
    return { controls, gui };
  }

  useEffect(() => {
    const { gui } = init();

    return () => {
      gui.destroy();
    }
  }, []);

  return (
    <div ref={ref} className={styles.container} />
  );
}

export default Frustum;
