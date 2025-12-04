import React from 'react';
import { history, Outlet } from 'umi';
import { Button } from 'antd';

const ExampleLayout: React.FC = () => {
  return (
    <>
      <Button
        type='primary'
        style={{ position: 'fixed', zIndex: 99999, left: 8, top: 8 }}
        onClick={() => history.push('/')}
      >
        返回
      </Button>
      <Outlet />
    </>
  );
}

export default ExampleLayout;
