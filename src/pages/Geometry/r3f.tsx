import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BufferGeometry, CubicBezierCurve3, DoubleSide, Mesh, Path, Shape, TubeGeometry, Vector2, Vector3 } from 'three';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Select } from 'antd';
import styles from './index.less';

const latheGeometryPoints = [
  new Vector2(0, 0),
  new Vector2(50, 50),
  new Vector2(20, 80),
  new Vector2(0, 150),
];

const LatheGeometryExample: React.FC = () => {
  const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints(latheGeometryPoints);
  }, []);

  return (
    <mesh>
      <latheGeometry args={[latheGeometryPoints, 5]} />
      <meshLambertMaterial color='pink' side={DoubleSide} />
      <points geometry={geometry}>
        <pointsMaterial color='blue' size={10} />
      </points>
      <line_ geometry={geometry}>
        <lineBasicMaterial />
      </line_>
    </mesh>
  );
}

const tubeGeometryPoints = [
  new Vector3(-100, 0, 0),
  new Vector3(50, 100, 0),
  new Vector3(100, 0, 100),
  new Vector3(100, 0, 0),
];

const tubeGeometryCurve = new CubicBezierCurve3(...tubeGeometryPoints);

interface TubeGeometryGuiProps {
  meshRef: React.RefObject<Mesh>;
}

const TubeGeometryGui: React.FC<TubeGeometryGuiProps> = (props) => {
  const { meshRef } = props;

  const createGui = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const gui = new GUI();
    const obj = {
      tubularSegments: 50,
      radius: 20,
      radialSegments: 20
    };
    const onChange = () => {
      mesh.geometry = new TubeGeometry(tubeGeometryCurve, obj.tubularSegments, obj.radius, obj.radialSegments);
    }
    gui.add(obj, 'tubularSegments').onChange(onChange).min(3).max(100).step(1).name('管道方向分段数');
    gui.add(obj, 'radius').onChange(onChange).min(10).max(100).step(0.1).name('半径');
    gui.add(obj, 'radialSegments').onChange(onChange).min(3).max(100).step(1).name('横截面分段数');
    return gui;
  }

  useEffect(() => {
    const gui = createGui();

    return () => {
      gui?.destroy();
    };
  }, []);

  return null;
}

const TubeGeometryExample: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints(tubeGeometryPoints);
  }, []);

  return (
    <>
      <mesh ref={meshRef}>
        <tubeGeometry args={[tubeGeometryCurve, 50, 20, 20]} />
        <meshLambertMaterial color='orange' side={DoubleSide} wireframe />
        <points geometry={geometry}>
          <pointsMaterial color='blue' size={10} />
        </points>
        <line_ geometry={geometry}>
          <lineBasicMaterial />
        </line_>
      </mesh>
      <TubeGeometryGui meshRef={meshRef} />
    </>
  );
}

const shapeGeometryPoints = [
  new Vector2(100, 0),
  new Vector2(50, 20),
  new Vector2(0, 0),
  new Vector2(0, 50),
  new Vector2(50, 100),
];

const ShapeGeometryExample: React.FC = () => {
  return (
    <mesh>
      <extrudeGeometry args={[new Shape(shapeGeometryPoints), { depth: 100 }]} />
      <meshLambertMaterial color='lightgreen' />
    </mesh>
  );
}

const ShapeExample: React.FC = () => {
  const geometryShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(100, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0, 50);
    shape.lineTo(80, 100);
    const path = new Path();
    path.arc(50, 50, 10, 0, Math.PI * 2);
    shape.holes.push(path);
    return shape;
  }, []);

  return (
    <mesh>
      <extrudeGeometry args={[geometryShape, { depth: 100 }]} />
      <meshLambertMaterial color='lightgreen' />
    </mesh>
  );
}

const meshMap = {
  latheGeometry: LatheGeometryExample,
  tubeGeometry: TubeGeometryExample,
  shapeGeometry: ShapeGeometryExample,
  shape: ShapeExample,
} satisfies Record<string, React.ComponentType>;

type MeshType = keyof typeof meshMap;

interface SceneProps {
  meshType: MeshType;
}

const Scene: React.FC<SceneProps> = (props) => {
  const { meshType } = props;
  const { camera } = useThree();
  const MeshComponent = meshMap[meshType];

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <MeshComponent />
      <directionalLight args={['#fff']} position={[100, 100, 100]} />
      <ambientLight />
      <axesHelper args={[200]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Geometry: React.FC = () => {
  const [meshType, setMeshType] = useState<MeshType>('latheGeometry');

  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 10000,
          position: [200, 200, 200],
        }}
      >
        <Scene meshType={meshType} />
      </Canvas>
      <Select<MeshType>
        className={styles.select}
        options={[
          { label: 'LatheGeometry', value: 'latheGeometry' },
          { label: 'TubeGeometry', value: 'tubeGeometry' },
          { label: 'ShapeGeometry', value: 'shapeGeometry' },
          { label: 'Shape', value: 'shape' },
        ]}
        value={meshType}
        onChange={setMeshType}
      />
    </div>
  );
}

export default Geometry;
