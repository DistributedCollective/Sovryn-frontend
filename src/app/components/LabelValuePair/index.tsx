import React from 'react';
import classNames from 'classnames';

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center',
      className,
    )}
  >
    <div className={classNames('tw-w-1/2 tw-text-gray-10', labelClassName)}>
      {label}
    </div>
    <div
      className={classNames('tw-pl-2 tw-w-1/2 tw-font-medium', valueClassName)}
    >
      {value}
    </div>
  </div>
);
