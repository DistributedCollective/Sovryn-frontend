import classNames from 'classnames';
import React from 'react';

type DataCardProps = {
  title: string;
  hasCustomHeight?: boolean;
  className?: String;
  children: React.ReactNode;
  noPadding?: boolean;
};

export const DataCard: React.FC<DataCardProps> = ({
  title,
  hasCustomHeight,
  className,
  children,
  noPadding = false,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-min-w-min tw-pt-1.5 tw-bg-black tw-rounded-xl',
      !hasCustomHeight && 'tw-flex-1',
      className,
    )}
  >
    <h2 className="tw-px-4 tw-py-1 tw-m-4 tw-mb-0 tw-text-sm tw-font-medium tw-border-b tw-border-sov-white">
      {title}
    </h2>
    <div className={classNames('tw-w-full tw-h-full', !noPadding && 'tw-p-4')}>
      {children}
    </div>
  </div>
);
