import React, { useEffect, useRef } from 'react';
import { AxesHelper, BoxGeometry, Mesh, MeshLambertMaterial, Object3DEventMap, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import styles from './index.less';

type MeshType = Mesh<BoxGeometry, MeshLambertMaterial, Object3DEventMap>;

const Cube: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

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
    render({ renderer, scene, camera });
    const controls = new OrbitControls(camera, renderer.domElement);
    const gui = createGui({ mesh, pointLight });
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

export default Cube;
