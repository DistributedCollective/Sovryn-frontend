import React from 'react';
import classNames from 'classnames';

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  label,
  value,
  className,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center',
      className,
    )}
  >
    <div className="tw-w-1/2 tw-text-gray-10">{label}</div>
    <div className="tw-pl-2 tw-w-1/2 tw-font-medium">{value}</div>
  </div>
);
