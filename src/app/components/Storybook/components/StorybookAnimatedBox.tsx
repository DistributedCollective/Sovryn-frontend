import React from 'react';
import classNames from 'classnames';

type StorybookAnimatedBoxProps = {
  className?: string;
  boxClassName?: string;
  boxStyle?: React.CSSProperties;
  label: string;
  value: number | string;
};

export const StorybookAnimatedBox: React.FC<StorybookAnimatedBoxProps> = ({
  label,
  value,
  boxClassName,
  boxStyle,
  className,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-items-center tw-inline-block tw-w-48',
      className,
    )}
  >
    <div className="tw-p-4">
      <div
        className={classNames('tw-w-4 tw-h-4 tw-bg-primary', boxClassName)}
        style={boxStyle}
      />
    </div>
    <span className="tw-inline-block tw-px-2 tw-py-1 tw-mx-3 tw-my-3 tw-text-sov-white tw-bg-black tw-bg-opacity-50 tw-leading-tight">
      <strong>{label}</strong>
      <br />
      {value}
    </span>
  </div>
);
