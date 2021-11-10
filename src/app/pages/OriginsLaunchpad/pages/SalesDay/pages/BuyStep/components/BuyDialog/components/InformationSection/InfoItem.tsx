import React from 'react';
import classNames from 'classnames';

interface IInfoItemProps {
  label: string;
  value: string | JSX.Element;
  className?: string;
  isLastItem?: boolean;
}

export const InfoItem: React.FC<IInfoItemProps> = ({
  label,
  value,
  className,
  isLastItem,
}) => (
  <div
    className={classNames(
      'tw-text-left',
      isLastItem ? '' : 'tw-mb-8',
      className,
    )}
  >
    <div className="tw-text-xs tw-tracking-normal tw-mb-1">{label}</div>
    <div className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal tw-leading-8">
      {value}
    </div>
  </div>
);
