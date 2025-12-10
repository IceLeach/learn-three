import 'umi/typings';

import { Line } from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

// declare `line_` as a JSX element so that typescript doesn't complain
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'line_': ReactThreeFiber.Object3DNode<Line, typeof Line>,
    }
  }
}
