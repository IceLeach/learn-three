import React, { useEffect } from 'react';
import { AxesHelper, BoxGeometry, Mesh, MeshLambertMaterial, Object3DEventMap, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { useThrottleFn } from 'ahooks';
import styles from './index.less';

type MeshType = Mesh<BoxGeometry, MeshLambertMaterial, Object3DEventMap>;

const Cube: React.FC = () => {
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

  const createGui = (data: { mesh: MeshType, pointLight: PointLight }) => {
    const { mesh, pointLight } = data;
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
    return gui;
  }

  const init = () => {
    const scene = new Scene();
    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshLambertMaterial({ color: 'orange' });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    const axesHelper = new AxesHelper(200);
    scene.add(axesHelper);
    const pointLight = new PointLight('#fff', 10000);
    pointLight.position.set(80, 80, 80);
    scene.add(pointLight);
    const gui = createGui({ mesh, pointLight });
    const width = ref.current?.clientWidth || window.innerWidth;
    const height = ref.current?.clientHeight || window.innerHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    ref.current?.append(renderer.domElement);
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

export default Cube;
