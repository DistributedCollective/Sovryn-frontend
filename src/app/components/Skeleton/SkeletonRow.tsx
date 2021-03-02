import React from 'react';

interface Props {
  loadingText?: React.ReactNode;
}

export function SkeletonRow(props: Props) {
  return (
    <div className="tw-relative">
      <div className="tw-grid tw-grid-cols-4 tw-mt-0 tw-gap-8">
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
      <div className="tw-grid tw-grid-cols-6 tw-mt-6 tw-gap-8">
        <div className="tw-col-span-3">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="tw-col-span-1">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
      </div>
      {props.loadingText && (
        <div className="skeleton-overlay">
          <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
            <>{props.loadingText}</>
          </div>
        </div>
      )}
    </div>
  );
}
