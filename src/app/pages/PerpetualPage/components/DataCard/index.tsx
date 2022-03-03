import classNames from 'classnames';
import React from 'react';

type DataCardProps = {
  title: string;
  hasCustomHeight?: boolean;
  hasCustomWidth?: boolean;
  className?: String;
  children: React.ReactNode;
  hasPadding?: boolean;
  isFullWidth?: boolean;
};

export const DataCard: React.FC<DataCardProps> = ({
  title,
  hasCustomHeight,
  hasCustomWidth,
  className,
  children,
  hasPadding = true,
  isFullWidth = true,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-pt-1.5 tw-bg-gray-2.5 tw-rounded-xl',
      {
        'tw-flex-1': !hasCustomHeight,
        'tw-min-w-min': !hasCustomWidth,
      },
      className,
    )}
  >
    <h2 className="tw-px-4 tw-py-1 tw-mx-4 tw-mb-0 tw-text-sm tw-font-medium tw-border-b tw-border-sov-white">
      {title}
    </h2>
    <div
      className={classNames('tw-h-full', {
        'tw-w-full': isFullWidth,
        'tw-p-4': hasPadding,
      })}
    >
      {children}
    </div>
  </div>
);
