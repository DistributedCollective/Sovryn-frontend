import React from 'react';
import classNames from 'classnames';
import { SpinnerSizeType } from './types';
import styles from './index.module.scss';

interface ISpinnerProps {
  className?: string;
  size?: SpinnerSizeType;
}

export const Spinner: React.FC<ISpinnerProps> = ({
  className,
  size = SpinnerSizeType.STANDARD,
}) => (
  <div className={classNames(styles.spinner, className)}>
    <svg
      className="tw-animate-spin-fast"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      strokeWidth={8}
    >
      <path
        d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
        fillOpacity={0}
      />
      <path
        className="tw-stroke-current"
        d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
        strokeDasharray="280 280"
        strokeDashoffset={210}
        strokeLinecap="round"
        pathLength={280}
        fillOpacity={0}
      />
    </svg>
  </div>
);
