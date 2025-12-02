import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';

const PageLoading: React.FC = () => {
  return (
    <div className={styles.pageLoading}>
      <Spin />
    </div>
  );
}

export default PageLoading;
