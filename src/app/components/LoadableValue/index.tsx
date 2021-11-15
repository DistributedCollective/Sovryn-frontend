/**
 *
 * LoadableValue
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';

interface ILoadableValueProps {
  value: React.ReactNode;
  loading?: boolean;
  loaderContent?: React.ReactNode;
  tooltip?: React.ReactNode;
}

export function LoadableValue({
  value,
  tooltip,
  loading = false,
  loaderContent = 'Loading some value.',
}: ILoadableValueProps) {
  if (loading) {
    return (
      <span className="tw-skeleton-wrapper tw-inline-block tw-whitespace-nowrap tw-overflow-hidden tw-m-0 tw-p-0">
        <span className="bp3-skeleton tw-inline-block tw-m-0 tw-p-0">
          {loaderContent}
        </span>
      </span>
    );
  }

  if (tooltip) {
    return (
      <Tooltip content={<>{tooltip}</>}>
        <>{value}</>
      </Tooltip>
    );
  }

  return <>{value}</>;
}
