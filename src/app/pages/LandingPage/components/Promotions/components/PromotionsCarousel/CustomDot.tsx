import React from 'react';
import { DotProps } from 'react-multi-carousel';
import { Dot } from './styled';

export const CustomDot: React.FC<DotProps> = ({ onClick, active }) => (
  <Dot
    style={{ background: active ? '#e9eae9' : 'initial' }}
    onClick={() => onClick?.()}
  />
);
