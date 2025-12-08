import React, { useEffect } from 'react';
import { Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { createNoise2D } from 'simplex-noise';
import styles from './index.less';

const noise2D = createNoise2D();
const noiseZ = (x: number, y: number) => {
  return noise2D(x / 300, y / 300) * 50;
}

const Topography: React.FC = () => {
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

  const updatePosition = (mesh: Mesh) => {
    const geometry = mesh.geometry;
    const positions = geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = noiseZ(x, y);
      const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;
      positions.setZ(i, z + sinNum);
    }
    positions.needsUpdate = true;
  }

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, mesh: Mesh }) => {
    const { renderer, scene, camera, mesh } = data;
    updatePosition(mesh);
    mesh.rotateZ(0.001);
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createMesh = () => {
    const geometry = new PlaneGeometry(3000, 3000, 100, 100);
    const positions = geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = noiseZ(x, y);
      positions.setZ(i, z);
    }
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(Math.PI / 2);
    return mesh;
  }

  const init = () => {
    const scene = new Scene();
    const mesh = createMesh();
    scene.add(mesh);
    const renderer = new WebGLRenderer();
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ref.current?.appendChild(canvas);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(400, 150, 100);
    camera.lookAt(0, 0, 0);
    render({ renderer, scene, camera, mesh });
    const controls = new OrbitControls(camera, renderer.domElement);
    return { scene, controls };
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div ref={ref} className={styles.container} />
  );
}

export default Topography;
