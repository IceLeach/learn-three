import React, { useEffect, useRef } from 'react';
import { BufferGeometry, Color, EllipseCurve, Group, Line as ThreeLine, LineBasicMaterial, Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import styles from './index.less';

const Scene: React.FC = () => {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const geometryRef = useRef<BufferGeometry>(null);
  const circleGroupRef = useRef<Group>(null);
  const figureGroupRef = useRef<Group>(null);
  const figureGroup2Ref = useRef<Group>(null);

  useFrame(() => {
    groupRef.current?.children.forEach((item, index) => {
      const flag = index % 2 === 0 ? 1 : -1;
      item.rotation.z += 0.001 * index * flag;
    });
  });

  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const arc = new EllipseCurve(0, 0, 120, 120, 0, Math.PI * 2);
    const points = arc.getPoints(50);
    geometryRef.current?.setFromPoints(points);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      const R = 130;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const arc = new EllipseCurve(x, y, 10, 10, 0, Math.PI * 2);
      const points = arc.getPoints(50);
      const geometry = new BufferGeometry();
      geometry.setFromPoints(points);
      const material = new LineBasicMaterial({ color: new Color('white') });
      const line = new ThreeLine(geometry, material);
      circleGroupRef.current?.add(line);
    }
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
      const line = new ThreeLine(geometry, material);
      line.position.set(x, y, 0);
      line.rotation.z = angle;
      figureGroupRef.current?.add(line);
    }
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
      const line = new ThreeLine(geometry, material);
      line.position.set(x, y, 0);
      line.rotation.z = angle;
      figureGroup2Ref.current?.add(line);
    }
  }, []);

  return (
    <>
      <group ref={groupRef}>
        <Line
          points={new EllipseCurve(0, 0, 110, 110, 0, Math.PI * 2).getPoints(50)}
          color='#fff'
          lineWidth={5}
        />
        <line_>
          <bufferGeometry ref={geometryRef} />
          <lineBasicMaterial color='#fff' />
        </line_>
        <group ref={circleGroupRef} />
        <Line
          points={new EllipseCurve(0, 0, 142.5, 142.5, 0, Math.PI * 2).getPoints(50)}
          color='#fff'
          lineWidth={5}
        />
        <group ref={figureGroupRef} />
        <group ref={figureGroup2Ref} />
      </group>
      <directionalLight args={['#fff']} position={[500, 300, 600]} />
      <ambientLight />
      <axesHelper args={[1000]} />
      <OrbitControls enableDamping={false} />
    </>
  );
}

const Cloudscape: React.FC = () => {
  return (
    <div className={styles.container}>
      <Canvas
        flat
        camera={{
          fov: 60,
          near: 1,
          far: 10000,
          position: [0, 200, 600],
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default Cloudscape;
