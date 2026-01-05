import React, { useEffect, useRef, useState } from 'react';
import { AxesHelper, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DoubleSide, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Points, PointsMaterial, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { Select } from 'antd';
import styles from './index.less';

type ModelType = Points | Line | Mesh;

const createModelMap = {
  point: () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      100, 0, 0,
      0, 100, 0,
      0, 0, 100,
      100, 100, 0,
    ]);
    const attribute = new BufferAttribute(vertices, 3);
    geometry.setAttribute('position', attribute);
    const material = new PointsMaterial({
      color: new Color('orange'),
      size: 10,
    });
    const points = new Points(geometry, material);
    return points;
  },
  line: () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      100, 0, 0,
      0, 100, 0,
      0, 0, 100,
      100, 100, 0,
    ]);
    const attribute = new BufferAttribute(vertices, 3);
    geometry.setAttribute('position', attribute);
    const material = new LineBasicMaterial({ color: new Color('orange') });
    const line = new Line(geometry, material);
    return line;
  },
  mesh: () => {
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
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  plane: () => {
    const geometry = new PlaneGeometry(100, 100, 2, 3);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  cylinder: () => {
    const geometry = new CylinderGeometry(50, 50, 80);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
} satisfies Record<string, () => ModelType>;

type CreateModelType = keyof typeof createModelMap;

const Model: React.FC = () => {
  const [modelType, setModelType] = useState<CreateModelType>();
  const sceneRef = useRef<Scene>();
  const modelRef = useRef<ModelType>();
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

  const createModel = (type: CreateModelType) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const model = createModelMap[type]();
    const currentModel = modelRef.current;
    if (currentModel) {
      scene.remove(currentModel);
    }
    modelRef.current = model;
    scene.add(model);
    setModelType(type);
  }

  const init = () => {
    const scene = new Scene();
    sceneRef.current = scene;
    createModel('point');
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
      <Select<CreateModelType>
        className={styles.select}
        options={[
          { label: '点模型', value: 'point' },
          { label: '线模型', value: 'line' },
          { label: '网格模型', value: 'mesh' },
          { label: '平面', value: 'plane' },
          { label: '圆柱体', value: 'cylinder' },
        ]}
        value={modelType}
        onChange={createModel}
      />
    </div>
  );
}

export default Model;
