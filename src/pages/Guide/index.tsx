import React from 'react';
import { Link } from 'umi';
import { Typography } from 'antd';
import styles from './index.less';

const Guide: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography>
        <Typography.Title level={2}>第一个 3D 场景 & dat.gui 可视化调试</Typography.Title>
        <Typography.Paragraph>
          <ul>
            <li><Link to='/cube'>Native</Link></li>
            <li><Link to='/cube-r3f'>react-three-fiber</Link></li>
          </ul>
        </Typography.Paragraph>
        <Typography.Title level={2}>深入理解透视相机和视椎体</Typography.Title>
        <Typography.Paragraph>
          <ul>
            <li><Link to='/frustum'>Native</Link></li>
            <li><Link to='/frustum-r3f'>react-three-fiber</Link></li>
          </ul>
        </Typography.Paragraph>
        <Typography.Title level={2}>BufferGeometry：顶点生成各种几何体</Typography.Title>
        <ul>
          <li><Link to='/vertice'>Native</Link></li>
          <li><Link to='/vertice-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>点模型、线模型、网格模型</Typography.Title>
        <ul>
          <li><Link to='/model'>Native</Link></li>
          <li><Link to='/model-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>实战：随机山脉地形</Typography.Title>
        <ul>
          <li><Link to='/topography'>Native</Link></li>
          <li><Link to='/topography-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>材质颜色和纹理贴图</Typography.Title>
        <ul>
          <li><Link to='/material-texture'>Native</Link></li>
          <li><Link to='/material-texture-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>uv 坐标和 uv 动画</Typography.Title>
        <ul>
          <li><Link to='/uv'>Native</Link></li>
          <li><Link to='/uv-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>如何画各种曲线</Typography.Title>
        <ul>
          <li><Link to='/curve'>Native</Link></li>
          <li><Link to='/curve-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>实战：云雷纹</Typography.Title>
        <ul>
          <li><Link to='/cloudscape'>Native</Link></li>
          <li><Link to='/cloudscape-r3f'>react-three-fiber</Link></li>
        </ul>
        <Typography.Title level={2}>按照规律生成各种几何体</Typography.Title>
        <ul>
          <li><Link to='/geometry'>Native</Link></li>
          <li><Link to='/geometry-r3f'>react-three-fiber</Link></li>
        </ul>
      </Typography>
    </div>
  );
}

export default Guide;
