/**
 *
 * LinkToExplorer
 *
 */
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  txHash: string;
  startLength: number;
  endLength: number;
}

export function LinkToExplorer(props: Props) {
  const handleTx = useCallback(() => {
    if (props.txHash && props.startLength && props.endLength) {
      const start = props.txHash.substr(0, props.startLength);
      const end = props.txHash.substr(-props.endLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, props.startLength, props.endLength]);

  const [txHash, setTxHash] = useState(handleTx());

  useEffect(() => {
    setTxHash(handleTx());
  }, [handleTx, props.txHash, props.startLength, props.endLength]);

  return (
    <a
      className="ml-1 text-white"
      href={`${process.env.REACT_APP_EXPLORER_URL}/tx/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {txHash}
    </a>
  );
}

LinkToExplorer.defaultProps = {
  startLength: 10,
  endLength: 4,
};
