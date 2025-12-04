import React from 'react';
import { Link } from 'umi';
import { Typography } from 'antd';

const Guide: React.FC = () => {
  return (
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
    </Typography>
  );
}

export default Guide;
