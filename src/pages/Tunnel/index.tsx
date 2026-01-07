import React, { useEffect, useRef } from 'react';
import { CatmullRomCurve3, DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, PointLight, RepeatWrapping, Scene, SRGBColorSpace, TextureLoader, TubeGeometry, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons';
import stone from './stone.png';
import styles from './index.less';

const Tunnel: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const pointIndexRef = useRef<number>(0);

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

  const render = (data: { renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, points: Vector3[] }) => {
    const { renderer, scene, camera, points } = data;
    const pointIndex = pointIndexRef.current;
    if (pointIndex < points.length - 1) {
      camera.position.copy(points[pointIndex]);
      camera.lookAt(points[pointIndex + 1]);
    } else {
      pointIndexRef.current = 0;
    }
    resetSize({ renderer, camera });
    renderer.render(scene, camera);
    requestAnimationFrame(() => render(data));
  }

  const createMesh = () => {
    const path = new CatmullRomCurve3([
      new Vector3(-100, 20, 90),
      new Vector3(-40, 80, 100),
      new Vector3(0, 0, 0),
      new Vector3(60, -60, 0),
      new Vector3(100, -40, 80),
      new Vector3(150, 60, 60),
    ]);
    const geometry = new TubeGeometry(path, 100, 5, 30);
    const loader = new TextureLoader();
    const texture = loader.load(stone);
    texture.wrapS = RepeatWrapping;
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.x = 20;
    const material = new MeshBasicMaterial({
      map: texture,
      aoMap: texture,
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    const points = path.getSpacedPoints(1000);
    return { mesh, points };
  }

  const init = () => {
    const scene = new Scene();
    const { mesh, points } = createMesh();
    scene.add(mesh);
    const pointLight = new PointLight('#fff', 200);
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
    render({ renderer, scene, camera, points });
    const controls = new OrbitControls(camera, renderer.domElement);
    return { controls };
  }

  useEffect(() => {
    init();
    const fn = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        pointIndexRef.current += 10;
      }
    }
    document.addEventListener('keydown', fn);

    return () => {
      document.removeEventListener('keydown', fn);
    }
  }, []);

  return (
    <div ref={ref} className={styles.container} />
  );
}

export default Tunnel;
