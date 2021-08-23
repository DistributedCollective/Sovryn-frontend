import React from 'react';
import { DotProps } from 'react-multi-carousel';
import { Dot } from './styled';
import cn from 'classnames';

export const CustomDot: React.FC<DotProps> = ({ onClick, active }) => (
  <Dot
    onClick={() => onClick?.()}
    className={cn('tw-cursor-pointer', { 'tw-bg-white': active })}
  />
);
