import React from 'react';
import { DotProps } from 'react-multi-carousel';
import classNames from 'classnames';

export const CustomDot: React.FC<DotProps> = ({ onClick, active }) => (
  <li
    onClick={() => onClick?.()}
    className={classNames(
      'tw-w-2.5 tw-h-2.5 tw-border tw-border-solid tw-border-sov-white tw-mr-4 tw-cursor-pointer tw-rounded-full',
      { 'tw-bg-white': active },
    )}
  />
);
