import React, { useEffect, useRef, useState } from 'react';
import { AmbientLight, AxesHelper, BufferGeometry, Color, CubicBezierCurve3, DirectionalLight, DoubleSide, ExtrudeGeometry, LatheGeometry, Line, LineBasicMaterial, Mesh, MeshLambertMaterial, Path, PerspectiveCamera, Points, PointsMaterial, Scene, Shape, TubeGeometry, Vector2, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { Select } from 'antd';
import styles from './index.less';

const createMeshMap = {
  latheGeometry: () => {
    const points = [
      new Vector2(0, 0),
      new Vector2(50, 50),
      new Vector2(20, 80),
      new Vector2(0, 150),
    ];
    const geometry = new LatheGeometry(points, 5);
    const material = new MeshLambertMaterial({
      color: new Color('pink'),
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints(points);
    const material2 = new PointsMaterial({
      color: new Color('blue'),
      size: 10,
    });
    const points2 = new Points(geometry2, material2);
    const line2 = new Line(geometry2, new LineBasicMaterial());
    mesh.add(points2, line2);
    return { mesh, gui: undefined };
  },
  tubeGeometry: () => {
    const p1 = new Vector3(-100, 0, 0);
    const p2 = new Vector3(50, 100, 0);
    const p3 = new Vector3(100, 0, 100);
    const p4 = new Vector3(100, 0, 0);
    const curve = new CubicBezierCurve3(p1, p2, p3, p4);
    const geometry = new TubeGeometry(curve, 50, 20, 20);
    const material = new MeshLambertMaterial({
      color: new Color('orange'),
      side: DoubleSide,
      wireframe: true,
    });
    const mesh = new Mesh(geometry, material);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints([p1, p2, p3, p4]);
    const material2 = new PointsMaterial({
      color: new Color('blue'),
      size: 10,
    });
    const points2 = new Points(geometry2, material2);
    const line2 = new Line(geometry2, new LineBasicMaterial());
    mesh.add(points2, line2);
    const gui = new GUI();
    const obj = {
      tubularSegments: 50,
      radius: 20,
      radialSegments: 20
    };
    const onChange = () => {
      mesh.geometry = new TubeGeometry(curve, obj.tubularSegments, obj.radius, obj.radialSegments);
    }
    gui.add(obj, 'tubularSegments').onChange(onChange).min(3).max(100).step(1).name('管道方向分段数');
    gui.add(obj, 'radius').onChange(onChange).min(10).max(100).step(0.1).name('半径');
    gui.add(obj, 'radialSegments').onChange(onChange).min(3).max(100).step(1).name('横截面分段数');
    return { mesh, gui };
  },
  shapeGeometry: () => {
    const points = [
      new Vector2(100, 0),
      new Vector2(50, 20),
      new Vector2(0, 0),
      new Vector2(0, 50),
      new Vector2(50, 100),
    ];
    const shape = new Shape(points);
    const geometry = new ExtrudeGeometry(shape, { depth: 100 });
    const material = new MeshLambertMaterial({ color: new Color('lightgreen') });
    const mesh = new Mesh(geometry, material);
    return { mesh, gui: undefined };
  },
  shape: () => {
    const shape = new Shape();
    shape.moveTo(100, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0, 50);
    shape.lineTo(80, 100);
    const path = new Path();
    path.arc(50, 50, 10, 0, Math.PI * 2);
    shape.holes.push(path);
    const geometry = new ExtrudeGeometry(shape, { depth: 100 });
    const material = new MeshLambertMaterial({ color: new Color('lightgreen') });
    const mesh = new Mesh(geometry, material);
    return { mesh, gui: undefined };
  },
} satisfies Record<string, () => { mesh: Mesh; gui?: GUI }>;

type CreateMeshType = keyof typeof createMeshMap;

const Geometry: React.FC = () => {
  const [meshType, setMeshType] = useState<CreateMeshType>();
  const ref = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene>();
  const meshRef = useRef<{ mesh: Mesh; gui?: GUI }>();

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
    const { mesh, gui } = createMeshMap[type]();
    const currentMesh = meshRef.current;
    if (currentMesh) {
      scene.remove(currentMesh.mesh);
      currentMesh.gui?.destroy();
    }
    meshRef.current = { mesh, gui };
    scene.add(mesh);
    setMeshType(type);
  }

  const init = () => {
    const scene = new Scene();
    sceneRef.current = scene;
    createMesh('latheGeometry');
    const directionLight = new DirectionalLight('#fff');
    directionLight.position.set(100, 100, 100);
    scene.add(directionLight);
    const ambientLight = new AmbientLight();
    scene.add(ambientLight);
    const axesHelper = new AxesHelper(200);
    scene.add(axesHelper);
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
      <Select<CreateMeshType>
        className={styles.select}
        options={[
          { label: 'LatheGeometry', value: 'latheGeometry' },
          { label: 'TubeGeometry', value: 'tubeGeometry' },
          { label: 'ShapeGeometry', value: 'shapeGeometry' },
          { label: 'Shape', value: 'shape' },
        ]}
        value={meshType}
        onChange={createMesh}
      />
    </div>
  );
}

export default Geometry;
