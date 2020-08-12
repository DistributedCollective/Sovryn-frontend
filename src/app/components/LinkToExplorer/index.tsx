/**
 *
 * LinkToExplorer
 *
 */
import React from 'react';

interface Props {
  txHash: string;
}

export function LinkToExplorer(props: Props) {
  return (
    <a
      className="ml-1"
      href={`${process.env.REACT_APP_EXPLORER_URL}/tx/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {props.txHash}
    </a>
  );
}
