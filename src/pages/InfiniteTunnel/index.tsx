import React, { useEffect, useRef } from 'react';
import { BackSide, Clock, CylinderGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, RepeatWrapping, Scene, SRGBColorSpace, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import storm from './storm.png';
import styles from './index.less';

const clock = new Clock();

const InfiniteTunnel: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const hRef = useRef<number>(0);

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

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, animate: () => void }) => {
    const { renderer, scene, camera, animate } = data;
    animate();
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createMesh = () => {
    const geometry = new CylinderGeometry(30, 50, 1000, 32, 32, true);
    const loader = new TextureLoader();
    const texture = loader.load(storm);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 2);
    const material = new MeshBasicMaterial({
      transparent: true,
      alphaMap: texture,
      side: BackSide,
    });
    const mesh = new Mesh(geometry, material);
    const animate = () => {
      const delta = clock.getDelta();
      hRef.current += 0.002;
      if (hRef.current > 1) {
        hRef.current = 0;
      }
      material.color.setHSL(hRef.current, 0.5, 0.5);
      material.alphaMap?.offset.setY(material.alphaMap.offset.y + delta * 0.5);
      mesh.rotation.y += delta * 0.5;
    }
    return { mesh, animate };
  }

  const init = () => {
    const scene = new Scene();
    const { mesh, animate } = createMesh();
    scene.add(mesh);
    const renderer = new WebGLRenderer();
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ref.current?.appendChild(canvas);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0.9, -520, 6.5);
    camera.lookAt(0, 0, 0);
    render({ renderer, scene, camera, animate });
    const controls = new OrbitControls(camera, renderer.domElement);
    return { controls };
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div ref={ref} className={styles.container} />
  );
}

export default InfiniteTunnel;
