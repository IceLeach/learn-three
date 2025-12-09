import React, { useEffect, useState } from 'react';
import { BoxGeometry, Color, EdgesGeometry, Line, LineDashedMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping, Scene, SphereGeometry, SRGBColorSpace, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { Select } from 'antd';
import diqiu from './diqiu.jpg';
import zhuan from './zhuan.jpg';
import styles from './index.less';

type ModelType = Line | Mesh;

const createModelMap = {
  lineDashed: () => {
    const boxGeometry = new BoxGeometry(100, 100, 100);
    const geometry = new EdgesGeometry(boxGeometry);
    const material = new LineDashedMaterial({
      color: new Color('orange'),
      dashSize: 10,
      gapSize: 10,
    });
    const line = new Line(geometry, material);
    line.computeLineDistances();
    return line;
  },
  plane: () => {
    const geometry = new PlaneGeometry(100, 100);
    const material = new MeshBasicMaterial({
      color: new Color('orange'),
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  earth: () => {
    const loader = new TextureLoader();
    const texture = loader.load(diqiu);
    texture.colorSpace = SRGBColorSpace;
    const geometry = new SphereGeometry(100);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
  wall: () => {
    const loader = new TextureLoader();
    const texture = loader.load(zhuan);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.colorSpace = SRGBColorSpace;
    const geometry = new PlaneGeometry(1000, 1000);
    const material = new MeshBasicMaterial({
      map: texture,
      aoMap: texture,
    });
    const mesh = new Mesh(geometry, material);
    return mesh;
  },
} satisfies Record<string, () => ModelType>;

type CreateModelType = keyof typeof createModelMap;

const MaterialTexture: React.FC = () => {
  const [modelType, setModelType] = useState<CreateModelType>();
  const sceneRef = React.useRef<Scene>();
  const modelRef = React.useRef<ModelType>();
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
    createModel('lineDashed');
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
    const camera = new PerspectiveCamera(60, width / height, 1, 10000);
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
          { label: '虚线材质', value: 'lineDashed' },
          { label: '平面', value: 'plane' },
          { label: '地球', value: 'earth' },
          { label: '墙', value: 'wall' },
        ]}
        value={modelType}
        onChange={createModel}
      />
    </div>
  );
}

export default MaterialTexture;
