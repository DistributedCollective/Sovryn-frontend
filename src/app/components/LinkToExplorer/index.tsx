/**
 *
 * LinkToExplorer
 *
 */
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  txHash: string;
  trimLength: number;
}

export function LinkToExplorer(props: Props) {
  const handleTx = useCallback(() => {
    if (props.txHash && props.trimLength) {
      const start = props.txHash.substr(0, props.trimLength + 2);
      const end = props.txHash.substr(-props.trimLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, props.trimLength]);

  const [txHash, setTxHash] = useState(handleTx());

  useEffect(() => {
    setTxHash(handleTx());
  }, [handleTx, props.txHash, props.trimLength]);

  return (
    <a
      className="ml-1"
      href={`${process.env.REACT_APP_EXPLORER_URL}/tx/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {txHash}
    </a>
  );
}

LinkToExplorer.defaultProps = {
  trimLength: 4,
};
