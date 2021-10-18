import classNames from 'classnames';
import React from 'react';

type DataCardProps = {
  title: string;
  hasCustomHeight?: boolean;
  className?: String;
  children: React.ReactNode;
};

export const DataCard: React.FC<DataCardProps> = ({
  title,
  hasCustomHeight,
  className,
  children,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-min-w-min tw-px-4 tw-pt-1.5 tw-pb-4 tw-bg-black tw-rounded-xl',
      !hasCustomHeight && 'tw-flex-1',
      className,
    )}
  >
    <h2 className="tw-px-4 tw-py-1 tw-mb-4 tw-text-sm tw-font-medium tw-border-b tw-border-sov-white">
      {title}
    </h2>
    {children}
  </div>
);
