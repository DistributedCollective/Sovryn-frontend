import React from 'react';
import { DotProps } from 'react-multi-carousel';
import classNames from 'classnames';
import styles from './index.module.scss';

export const CustomDot: React.FC<DotProps> = ({ onClick, active }) => (
  <li
    onClick={() => onClick?.()}
    className={classNames(styles.dot, { 'tw-bg-white': active })}
  />
);
