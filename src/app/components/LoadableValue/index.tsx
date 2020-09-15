/**
 *
 * LoadableValue
 *
 */
import React from 'react';

interface Props {
  value: React.ReactNode;
  loading: boolean;
  loaderContent: React.ReactNode;
}

export function LoadableValue(props: Props) {
  if (props.loading) {
    return <span className="bp3-skeleton">{props.loaderContent}</span>;
  }
  return <>{props.value}</>;
}

LoadableValue.defaultProps = {
  loaderContent: 'Loading some value.',
};
