import React from 'react';

interface Props {
  loadingText?: React.ReactNode;
}

export function SkeletonRow(props: Props) {
  return (
    <div className="position-relative">
      <div className="row mt-3">
        <div className="col-3">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="col-6">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="col-3">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-6">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
        <div className="col-2">
          <div className="bp3-skeleton">&nbsp;</div>
        </div>
      </div>
      {props.loadingText && (
        <div className="skeleton-overlay">
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <>{props.loadingText}</>
          </div>
        </div>
      )}
    </div>
  );
}
