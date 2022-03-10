import classNames from 'classnames';
import React from 'react';
import { ReactComponent as Xmark } from 'assets/images/xmark.svg';

type DataCardProps = {
  title: string;
  hasCustomHeight?: boolean;
  hasCustomWidth?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  hasPadding?: boolean;
  onClose?: () => void;
};

export const DataCard: React.FC<DataCardProps> = ({
  title,
  hasCustomHeight,
  hasCustomWidth,
  className,
  contentClassName,
  children,
  hasPadding = true,
  onClose,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-pt-1.5 tw-bg-gray-2.5 tw-rounded-xl',
      {
        'tw-h-max': !hasCustomHeight,
        'tw-min-w-min': !hasCustomWidth,
      },
      className,
    )}
  >
    <div className="tw-flex tw-border-b tw-border-sov-white tw-justify-between tw-items-center tw-mx-4">
      <h2 className="tw-px-4 tw-py-1 tw-mb-0 tw-text-sm tw-font-medium">
        {title}
      </h2>
      {onClose && (
        <div
          className="tw-w-4 tw-h-4 tw-p-1 tw-bg-gray-6 hover:tw-bg-gray-5 tw-text-sm tw-text-sov-white tw-rounded-sm tw-cursor-pointer"
          onClick={onClose}
        >
          <Xmark className="tw-w-2 tw-h-2" />
        </div>
      )}
    </div>
    <div
      className={classNames('tw-flex-auto tw-h-full', contentClassName, {
        'tw-p-4': hasPadding,
      })}
    >
      {children}
    </div>
  </div>
);
