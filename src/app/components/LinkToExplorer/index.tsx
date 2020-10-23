/**
 *
 * LinkToExplorer
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { blockExplorers, currentChainId } from '../../../utils/classifiers';

interface Props {
  txHash: string;
  startLength: number;
  endLength: number;
  className: string;
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
  const [url, setUrl] = useState(blockExplorers[currentChainId]);

  const { chainId } = useSelector(selectWalletProvider);

  useEffect(() => {
    setTxHash(handleTx());
  }, [handleTx, props.txHash, props.startLength, props.endLength]);

  useEffect(() => {
    setUrl(blockExplorers[currentChainId]);
  }, [chainId]);

  return (
    <a
      className={props.className}
      href={`${url}/tx/${props.txHash}`}
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
  className: 'ml-1 text-white',
};
