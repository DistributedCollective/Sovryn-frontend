import React, { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type MenuSeparatorProps = {
  className?: string;
  text?: ReactNode;
};

export const MenuSeparator: React.FC<MenuSeparatorProps> = ({
  className,
  text,
}) => {
  return <li className={classNames(styles.host, className)}>{text}</li>;
};
