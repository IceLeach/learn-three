import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { BufferGeometry, CubicBezierCurve3, CurvePath, EllipseCurve, LineCurve, QuadraticBezierCurve, SplineCurve, Vector2, Vector3 } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './index.less';

const EllipseCurveExample: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    const curve = new EllipseCurve(0, 0, 100, 100, 0, Math.PI / 2);
    const pointsList = curve.getPoints(50);
    geometryRef.current?.setFromPoints(pointsList);
  }, []);

  return (
    <line_>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color='orange' />
    </line_>
  );
}

const splineCurvePoints = [
  new Vector2(-100, 0),
  new Vector2(-50, 50),
  new Vector2(0, 0),
  new Vector2(50, -50),
  new Vector2(100, -30),
  new Vector2(100, 0),
];

const SplineCurveGeometry: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    const curve = new SplineCurve(splineCurvePoints);
    const pointsList = curve.getPoints(20);
    geometryRef.current?.setFromPoints(pointsList);
  }, []);

  return (
    <bufferGeometry ref={geometryRef} />
  );
}

const SplineCurveGeometry2: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    geometryRef.current?.setFromPoints(splineCurvePoints);
  }, []);

  return (
    <bufferGeometry ref={geometryRef} />
  );
}

const SplineCurveExample: React.FC = () => {
  return (
    <line_>
      <SplineCurveGeometry />
      <lineBasicMaterial color='orange' />
      <points>
        <SplineCurveGeometry />
        <pointsMaterial color='pink' size={5} />
      </points>
      <points>
        <SplineCurveGeometry2 />
        <pointsMaterial color='green' size={10} />
      </points>
      <line_>
        <SplineCurveGeometry2 />
        <lineBasicMaterial />
      </line_>
    </line_>
  );
}

const quadraticBezierCurvePoints = [
  new Vector2(0, 0),
  new Vector2(50, 200),
  new Vector2(100, 0),
];

const QuadraticBezierCurveGeometry2: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    geometryRef.current?.setFromPoints(quadraticBezierCurvePoints);
  }, []);

  return (
    <bufferGeometry ref={geometryRef} />
  );
}

const QuadraticBezierCurveExample: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    const curve = new QuadraticBezierCurve(...quadraticBezierCurvePoints);
    const pointsList = curve.getPoints(20);
    geometryRef.current?.setFromPoints(pointsList);
  }, []);

  return (
    <line_>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color='orange' />
      <points>
        <QuadraticBezierCurveGeometry2 />
        <pointsMaterial color='pink' size={5} />
      </points>
      <line_>
        <QuadraticBezierCurveGeometry2 />
        <lineBasicMaterial />
      </line_>
    </line_>
  );
}

const cubicBezierCurve3Points = [
  new Vector3(-100, 0, 0),
  new Vector3(50, 100, 0),
  new Vector3(100, 0, 100),
  new Vector3(100, 0, 0),
];

const CubicBezierCurve3Geometry2: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    geometryRef.current?.setFromPoints(cubicBezierCurve3Points);
  }, []);

  return (
    <bufferGeometry ref={geometryRef} />
  );
}

const CubicBezierCurve3Example: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
    const curve = new CubicBezierCurve3(...cubicBezierCurve3Points);
    const pointsList = curve.getPoints(20);
    geometryRef.current?.setFromPoints(pointsList);
  }, []);

  return (
    <line_>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color='orange' />
      <points>
        <CubicBezierCurve3Geometry2 />
        <pointsMaterial color='pink' size={5} />
      </points>
      <line_>
        <CubicBezierCurve3Geometry2 />
        <lineBasicMaterial />
      </line_>
    </line_>
  );
}

const CurvePathExample: React.FC = () => {
  const geometryRef = useRef<BufferGeometry>(null);

  useEffect(() => {
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
    geometryRef.current?.setFromPoints(pointsList as Vector2[]);
  }, []);

  return (
    <line_>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color='pink' />
    </line_>
  );
}

const meshMap = {
  ellipseCurve: EllipseCurveExample,
  splineCurve: SplineCurveExample,
  quadraticBezierCurve: QuadraticBezierCurveExample,
  cubicBezierCurve3: CubicBezierCurve3Example,
  curvePath: CurvePathExample,
} satisfies Record<string, React.ComponentType>;

type MeshType = keyof typeof meshMap;

interface SceneProps {
  lineType: MeshType;
}

const Scene: React.FC<SceneProps> = (props) => {
  const { lineType } = props;
  const { camera } = useThree();
  const LineComponent = meshMap[lineType];

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <LineComponent />
      <axesHelper args={[200]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Curve: React.FC = () => {
  const [lineType, setLineType] = useState<MeshType>('ellipseCurve');

  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 1000,
          position: [0, 100, 200],
        }}
      >
        <Scene lineType={lineType} />
      </Canvas>
      <Select<MeshType>
        className={styles.select}
        options={[
          { label: 'EllipseCurve', value: 'ellipseCurve' },
          { label: 'SplineCurve', value: 'splineCurve' },
          { label: 'QuadraticBezierCurve', value: 'quadraticBezierCurve' },
          { label: 'CubicBezierCurve3', value: 'cubicBezierCurve3' },
          { label: 'CurvePath', value: 'curvePath' },
        ]}
        value={lineType}
        onChange={setLineType}
      />
    </div>
  );
}

export default Curve;
