import classNames from 'classnames';
import React from 'react';

interface Props {
  loadingText?: React.ReactNode;
  className?: string;
}

export function SkeletonRow({ loadingText, className }: Props) {
  return (
    <div className={classNames('tw-relative', className)}>
      <div className="tw-grid tw-gap-8 tw-grid-cols-4 tw-mt-0">
        <div className="tw-col-span-1">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="tw-col-span-2">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="tw-col-span-1">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw-grid-cols-6 tw-mt-6">
        <div className="tw-col-span-3">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="tw-col-span-1">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
      </div>
      {loadingText && (
        <div className="tw-skeleton-overlay">
          <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
            <>{loadingText}</>
          </div>
        </div>
      )}
    </div>
  );
}
