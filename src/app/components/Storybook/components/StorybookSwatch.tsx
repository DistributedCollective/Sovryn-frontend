import React from 'react';
import classNames from 'classnames';

type StorybookSwatchProps = {
  style?: any;
  className?: string;
  label: string;
  value: number | string;
};

export const StorybookSwatch: React.FC<StorybookSwatchProps> = ({
  label,
  value,
  style,
  className,
}) => (
  <div
    className={classNames('tw-inline-block tw-w-48', className)}
    style={style}
  >
    <span className="tw-inline-block tw-px-2 tw-py-1 tw-mx-3 tw-my-3 tw-text-sov-white tw-bg-black tw-bg-opacity-50 tw-leading-tight">
      <strong>{label}</strong>
      <br />
      {value}
    </span>
  </div>
);
