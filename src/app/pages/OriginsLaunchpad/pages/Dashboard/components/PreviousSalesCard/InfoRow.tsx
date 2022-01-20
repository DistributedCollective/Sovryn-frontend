import React from 'react';
import classNames from 'classnames';
import { InfoRowValue } from './styled';

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
    <InfoRowValue>{value}</InfoRowValue>
  </div>
);
