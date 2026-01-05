import React, { useEffect, useRef, useState } from 'react';
import { AxesHelper, BufferAttribute, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, SphereGeometry, SRGBColorSpace, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { Select } from 'antd';
import bg from './bg.png';
import muxing from './muxing.jpg';
import styles from './index.less';

const createMeshMap = {
  coordinate: () => {
    const geometry = new PlaneGeometry(200, 100);
    const uvs = new Float32Array([
      0, 0.5,
      0.5, 0.5,
      0, 0,
      0.5, 0,
    ]);
    geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
    const loader = new TextureLoader();
    const texture = loader.load(bg);
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);
    return { mesh, animate: undefined };
  },
  animation: () => {
    const geometry = new SphereGeometry(50);
    const loader = new TextureLoader();
    const texture = loader.load(muxing);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapT = RepeatWrapping;
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);
    const animate = () => {
      material.map?.offset.setY(material.map.offset.y + 0.01);
    }
    return { mesh, animate };
  },
} satisfies Record<string, () => { mesh: Mesh; animate?: () => void }>;

type CreateMeshType = keyof typeof createMeshMap;

const Uv: React.FC = () => {
  const [meshType, setMeshType] = useState<CreateMeshType>();
  const sceneRef = useRef<Scene>();
  const meshRef = useRef<Mesh>();
  const ref = useRef<HTMLDivElement>(null);
  const animateRef = useRef<() => void>();

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
    animateRef.current?.();
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createMesh = (type: CreateMeshType) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const { mesh, animate } = createMeshMap[type]();
    const currentMesh = meshRef.current;
    if (currentMesh) {
      scene.remove(currentMesh);
    }
    meshRef.current = mesh;
    scene.add(mesh);
    animateRef.current = animate;
    setMeshType(type);
  }

  const init = () => {
    const scene = new Scene();
    sceneRef.current = scene;
    createMesh('coordinate');
    const axesHelper = new AxesHelper(200);
    scene.add(axesHelper);
    const renderer = new WebGLRenderer();
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ref.current?.appendChild(canvas);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
    render({ renderer, scene, camera });
    const controls = new OrbitControls(camera, renderer.domElement);
    return { controls };
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <Select<CreateMeshType>
        className={styles.select}
        options={[
          { label: 'uv 坐标', value: 'coordinate' },
          { label: 'uv 动画', value: 'animation' },
        ]}
        value={meshType}
        onChange={createMesh}
      />
    </div>
  );
}

export default Uv;
