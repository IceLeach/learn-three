import React, { useEffect } from 'react';
import { CameraHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { useThrottleFn } from 'ahooks';
import styles from './index.less';

const Frustum: React.FC = () => {
  const sceneRef = React.useRef<Scene>();
  const cameraRef = React.useRef<PerspectiveCamera>();
  const rendererRef = React.useRef<WebGLRenderer>();
  const ref = React.useRef<HTMLDivElement>(null);

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera }) => {
    const { renderer, scene, camera } = data;
    requestAnimationFrame(() => render(data));
    renderer.render(scene, camera);
  }

  const { run: resetSize } = useThrottleFn(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!scene || !camera || !renderer) return;
    const width = ref.current?.clientWidth || window.innerWidth;
    const height = ref.current?.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, { wait: 100 });

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
    const width = ref.current?.clientWidth || window.innerWidth;
    const height = ref.current?.clientHeight || window.innerHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    const camera2 = new PerspectiveCamera(20, 16 / 9, 100, 300);
    const cameraHelper = new CameraHelper(camera2);
    scene.add(cameraHelper);
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    const gui = createGui({ camera: camera2, cameraHelper });
    ref.current?.appendChild(renderer.domElement);
    render({ renderer, scene, camera });
    const controls = new OrbitControls(camera, renderer.domElement);
    return { scene, camera, renderer, controls, gui };
  }

  useEffect(() => {
    const { scene, camera, renderer, gui } = init();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    if (ref.current) {
      const observer = new ResizeObserver(resetSize);
      observer.observe(ref.current);
    }

    return () => {
      gui.destroy();
    }
  }, []);

  return (
    <div ref={ref} className={styles.container} />
  );
}

export default Frustum;
