import React from 'react';
import classNames from 'classnames';

interface IInfoRowProps {
  label: string;
  value: string;
  className?: string;
}

export const InfoRow: React.FC<IInfoRowProps> = ({
  label,
  value,
  className,
}) => (
  <div className={classNames('tw-tracking-normal', className)}>
    <div className="tw-text-sm tw-font-thin tw-tracking-normal tw-leading-tight">
      {label}:
    </div>
    <div className="tw-font-orbitron tw-text-sm tw-tracking-normal tw-leading-tight tw-mt-1 tw-font-medium">
      {value}
    </div>
  </div>
);
