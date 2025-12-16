import React, { useEffect, useState } from 'react';
import { AxesHelper, BufferGeometry, Color, CubicBezierCurve3, CurvePath, EllipseCurve, Line, LineBasicMaterial, LineCurve, PerspectiveCamera, Points, PointsMaterial, QuadraticBezierCurve, Scene, SplineCurve, Vector2, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import { Select } from 'antd';
import styles from './index.less';

const createLineMap = {
  ellipseCurve: () => {
    const curve = new EllipseCurve(0, 0, 100, 100, 0, Math.PI / 2);
    const pointsList = curve.getPoints(50);
    const geometry = new BufferGeometry();
    geometry.setFromPoints(pointsList);
    const material = new LineBasicMaterial({ color: new Color('orange') });
    const line = new Line(geometry, material);
    return line;
  },
  splineCurve: () => {
    const arr = [
      new Vector2(-100, 0),
      new Vector2(-50, 50),
      new Vector2(0, 0),
      new Vector2(50, -50),
      new Vector2(100, -30),
      new Vector2(100, 0)
    ];
    const curve = new SplineCurve(arr);
    const pointsList = curve.getPoints(20);
    const geometry = new BufferGeometry();
    geometry.setFromPoints(pointsList);
    const material = new LineBasicMaterial({ color: new Color('orange') });
    const line = new Line(geometry, material);
    const pointsMaterial = new PointsMaterial({
      color: new Color('pink'),
      size: 5,
    });
    const points = new Points(geometry, pointsMaterial);
    line.add(points);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints(arr);
    const material2 = new PointsMaterial({
      color: new Color('green'),
      size: 10,
    });
    const points2 = new Points(geometry2, material2);
    const line2 = new Line(geometry2, new LineBasicMaterial());
    line.add(points2, line2);
    return line;
  },
  quadraticBezierCurve: () => {
    const p1 = new Vector2(0, 0);
    const p2 = new Vector2(50, 200);
    const p3 = new Vector2(100, 0);
    const curve = new QuadraticBezierCurve(p1, p2, p3);
    const pointsList = curve.getPoints(20);
    const geometry = new BufferGeometry();
    geometry.setFromPoints(pointsList);
    const material = new LineBasicMaterial({ color: new Color('orange') });
    const line = new Line(geometry, material);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints([p1, p2, p3]);
    const material2 = new PointsMaterial({
      color: new Color('pink'),
      size: 5,
    });
    const points2 = new Points(geometry2, material2);
    const line2 = new Line(geometry2, new LineBasicMaterial());
    line.add(points2, line2);
    return line;
  },
  cubicBezierCurve3: () => {
    const p1 = new Vector3(-100, 0, 0);
    const p2 = new Vector3(50, 100, 0);
    const p3 = new Vector3(100, 0, 100);
    const p4 = new Vector3(100, 0, 0);
    const curve = new CubicBezierCurve3(p1, p2, p3, p4);
    const pointsList = curve.getPoints(20);
    const geometry = new BufferGeometry();
    geometry.setFromPoints(pointsList);
    const material = new LineBasicMaterial({ color: new Color('orange') });
    const line = new Line(geometry, material);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints([p1, p2, p3, p4]);
    const material2 = new PointsMaterial({
      color: new Color('pink'),
      size: 5,
    });
    const points2 = new Points(geometry2, material2);
    const line2 = new Line(geometry2, new LineBasicMaterial());
    line.add(points2, line2);
    return line;
  },
  curvePath: () => {
    const p1 = new Vector2(0, 0);
    const p2 = new Vector2(100, 100);
    const line1 = new LineCurve(p1, p2);
    const ellipse = new EllipseCurve(0, 100, 100, 100, 0, Math.PI);
    const p3 = new Vector2(-100, 100);
    const p4 = new Vector2(0, 0);
    const line2 = new LineCurve(p3, p4);
    const curvePath = new CurvePath();
    curvePath.add(line1);
    curvePath.add(ellipse);
    curvePath.add(line2);
    const pointsList = curvePath.getPoints(20);
    const geometry = new BufferGeometry();
    geometry.setFromPoints(pointsList as Vector2[]);
    const material = new LineBasicMaterial({ color: new Color('pink') });
    const line = new Line(geometry, material);
    return line;
  },
} satisfies Record<string, () => Line>;

type CreateLineType = keyof typeof createLineMap;

const Curve: React.FC = () => {
  const [lineType, setLineType] = useState<CreateLineType>();
  const sceneRef = React.useRef<Scene>();
  const lineRef = React.useRef<Line>();
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

  const createLine = (type: CreateLineType) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const line = createLineMap[type]();
    const currentLine = lineRef.current;
    if (currentLine) {
      scene.remove(currentLine);
    }
    lineRef.current = line;
    scene.add(line);
    setLineType(type);
  }

  const init = () => {
    const scene = new Scene();
    sceneRef.current = scene;
    createLine('ellipseCurve');
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
    camera.position.set(0, 100, 200);
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
      <Select<CreateLineType>
        className={styles.select}
        options={[
          { label: 'EllipseCurve', value: 'ellipseCurve' },
          { label: 'SplineCurve', value: 'splineCurve' },
          { label: 'QuadraticBezierCurve', value: 'quadraticBezierCurve' },
          { label: 'CubicBezierCurve3', value: 'cubicBezierCurve3' },
          { label: 'CurvePath', value: 'curvePath' },
        ]}
        value={lineType}
        onChange={createLine}
      />
    </div>
  );
}

export default Curve;
