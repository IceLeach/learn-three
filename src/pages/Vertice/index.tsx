import React, { useEffect, useRef, useState } from 'react';
import { AxesHelper, BoxGeometry, BufferAttribute, BufferGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { Select } from 'antd';
import styles from './index.less';

const createMeshMap = {
  triangle: () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      100, 0, 0,
      0, 100, 0,
      0, 0, 10,
      0, 0, 100,
      100, 0, 10,
    ]);
    const attribute = new BufferAttribute(vertices, 3);
    geometry.setAttribute('position', attribute);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  plane: () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      100, 0, 0,
      0, 100, 0,
      100, 100, 0,
    ]);
    const attribute = new BufferAttribute(vertices, 3);
    geometry.setAttribute('position', attribute);
    const indexes = new Uint16Array([0, 1, 2, 2, 1, 3]);
    geometry.index = new BufferAttribute(indexes, 1);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  plane2: () => {
    const geometry = new PlaneGeometry(100, 100);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  box: () => {
    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
} satisfies Record<string, () => Mesh>;

type CreateMeshType = keyof typeof createMeshMap;

const Vertice: React.FC = () => {
  const [meshType, setMeshType] = useState<CreateMeshType>();
  const sceneRef = useRef<Scene>();
  const meshRef = useRef<Mesh>();
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

  const createMesh = (type: CreateMeshType) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const mesh = createMeshMap[type]();
    const currentMesh = meshRef.current;
    if (currentMesh) {
      scene.remove(currentMesh);
    }
    meshRef.current = mesh;
    scene.add(mesh);
    setMeshType(type);
  }

  const init = () => {
    const scene = new Scene();
    sceneRef.current = scene;
    createMesh('triangle');
    const pointLight = new PointLight('#fff', 10000);
    pointLight.position.set(80, 80, 80);
    scene.add(pointLight);
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
    camera.position.set(200, 200, 200);
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
          { label: '三角形', value: 'triangle' },
          { label: '平面', value: 'plane' },
          { label: '平面2', value: 'plane2' },
          { label: '立方体', value: 'box' },
        ]}
        value={meshType}
        onChange={createMesh}
      />
    </div>
  );
};

export default Vertice;
