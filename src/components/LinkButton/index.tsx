import React from 'react';
import { Button, ButtonProps } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

type LinkButtonProps = Omit<ButtonProps, 'type'>;

const LinkButton: React.FC<LinkButtonProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <Button
      {...restProps}
      type='link'
      className={classNames(styles.linkButton, className)}
    />
  );
}

export default LinkButton;
