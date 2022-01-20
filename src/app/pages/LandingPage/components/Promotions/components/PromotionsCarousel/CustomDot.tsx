import React from 'react';
import { DotProps } from 'react-multi-carousel';
import { Dot } from './styled';
import classNames from 'classnames';

export const CustomDot: React.FC<DotProps> = ({ onClick, active }) => (
  <Dot
    onClick={() => onClick?.()}
    className={classNames('tw-cursor-pointer', { 'tw-bg-white': active })}
  />
);
