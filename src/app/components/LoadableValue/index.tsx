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
    return <span className="bp3-skeleton">{props.loaderContent}</span>;
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
