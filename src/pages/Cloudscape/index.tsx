import React, { useEffect, useRef } from 'react';
import { AmbientLight, AxesHelper, BufferGeometry, Color, DirectionalLight, EllipseCurve, Group, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { Line2, LineGeometry, LineMaterial, OrbitControls } from 'three/addons';
import styles from './index.less';

const Cloudscape: React.FC = () => {
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

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, mesh: Group }) => {
    const { renderer, scene, camera, mesh } = data;
    mesh.children.forEach((item, index) => {
      const flag = index % 2 === 0 ? 1 : -1;
      item.rotation.z += 0.001 * index * flag;
    });
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createMesh = () => {
    const group = new Group();
    const arc1 = new EllipseCurve(0, 0, 110, 110, 0, Math.PI * 2);
    const points1 = arc1.getPoints(50);
    const geometry1 = new LineGeometry();
    geometry1.setFromPoints(points1);
    const material1 = new LineMaterial({
      color: new Color('white'),
      linewidth: 5,
    });
    const line1 = new Line2(geometry1, material1);
    group.add(line1);
    const arc2 = new EllipseCurve(0, 0, 120, 120, 0, Math.PI * 2);
    const points2 = arc2.getPoints(50);
    const geometry2 = new BufferGeometry();
    geometry2.setFromPoints(points2);
    const material2 = new LineBasicMaterial({ color: new Color('white') });
    const line2 = new Line(geometry2, material2);
    group.add(line2);
    const circleGroup = new Group();
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      const R = 130;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const arc = new EllipseCurve(x, y, 10, 10, 0, Math.PI * 2);
      const points = arc.getPoints(50);
      const geometry = new BufferGeometry();
      geometry.setFromPoints(points);
      const material = new LineBasicMaterial({ color: new Color('white') });
      const line = new Line(geometry, material);
      circleGroup.add(line);
    }
    group.add(circleGroup);
    const arc3 = new EllipseCurve(0, 0, 142.5, 142.5, 0, Math.PI * 2);
    const points3 = arc3.getPoints(50);
    const geometry3 = new LineGeometry();
    geometry3.setFromPoints(points3);
    const material3 = new LineMaterial({
      color: new Color('white'),
      linewidth: 5,
    });
    const line3 = new Line2(geometry3, material3);
    group.add(line3);
    const figureGroup = new Group();
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
      const R = 200;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const points = [
        new Vector3(0, 0, 0),
        new Vector3(10, 0, 0),
        new Vector3(10, 10, 0),
        new Vector3(-10, 10, 0),
        new Vector3(-10, -10, 0),
        new Vector3(20, -10, 0),
        new Vector3(20, 20, 0),
        new Vector3(-20, 20, 0),
        new Vector3(-20, -20, 0),
        new Vector3(20, -20, 0),
      ];
      const geometry = new BufferGeometry();
      geometry.setFromPoints(points);
      const material = new LineBasicMaterial({ color: new Color('white') });
      const line = new Line(geometry, material);
      line.position.set(x, y, 0);
      line.rotation.z = angle;
      figureGroup.add(line);
    }
    group.add(figureGroup);
    const figureGroup2 = new Group();
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
      const R = 260;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const points = [
        new Vector3(0, 0, 0),
        new Vector3(15, 0, 0),
        new Vector3(15, 15, 0),
        new Vector3(-15, 15, 0),
        new Vector3(-15, -15, 0),
        new Vector3(30, -15, 0),
        new Vector3(30, 30, 0),
        new Vector3(-30, 30, 0),
        new Vector3(-30, -30, 0),
        new Vector3(30, -30, 0),
      ];
      const geometry = new BufferGeometry();
      geometry.setFromPoints(points);
      const material = new LineBasicMaterial({ color: new Color('white') });
      const line = new Line(geometry, material);
      line.position.set(x, y, 0);
      line.rotation.z = angle;
      figureGroup2.add(line);
    }
    group.add(figureGroup2);
    return group;
  }

  const init = () => {
    const scene = new Scene();
    const mesh = createMesh();
    scene.add(mesh);
    const light = new DirectionalLight('#fff');
    light.position.set(500, 300, 600);
    scene.add(light);
    const light2 = new AmbientLight();
    scene.add(light2);
    const axesHelper = new AxesHelper(1000);
    scene.add(axesHelper);
    const renderer = new WebGLRenderer();
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ref.current?.appendChild(canvas);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 200, 600);
    camera.lookAt(0, 0, 0);
    render({ renderer, scene, camera, mesh });
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

export default Cloudscape;
