/**
 *
 * LoadableValue
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';

interface Props {
  value: React.ReactNode;
  loading: boolean;
  loaderContent: React.ReactNode;
  tooltip?: React.ReactNode;
}

export function LoadableValue(props: Props) {
  if (props.loading) {
    return (
      <span className="skeleton-wrapper d-inline-block text-nowrap m-0 p-0">
        <span className="bp3-skeleton d-inline-block m-0 p-0">
          {props.loaderContent}
        </span>
      </span>
    );
  }

  if (props.tooltip) {
    return (
      <Tooltip content={<>{props.tooltip}</>}>
        <>{props.value}</>
      </Tooltip>
    );
  }

  return <>{props.value}</>;
}

LoadableValue.defaultProps = {
  loaderContent: 'Loading some value.',
};
