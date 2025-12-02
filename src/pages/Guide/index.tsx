import React from 'react';
import { Link } from 'umi';
import { Typography } from 'antd';

const Guide: React.FC = () => {
  return (
    <Typography>
      <Typography.Title level={2}>第一个 3D 场景</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li><Link to='/cube'>Native</Link></li>
          <li><Link to='/cube-r3f'>react-three-fiber</Link></li>
        </ul>
      </Typography.Paragraph>
    </Typography>
  );
}

export default Guide;
