/**
 *
 * AddressBadge
 *
 */
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { WalletContext } from '@sovryn/react-wallet';
import { blockExplorers, currentChainId } from '../../../utils/classifiers';

interface Props {
  txHash: string;
  startLength: number;
  endLength: number;
  className: string;
  realBtc?: boolean;
  text?: string;
}

export function AddressBadge(props: Props) {
  const handleTx = useCallback(() => {
    if (props.txHash && props.startLength && props.endLength) {
      const start = props.txHash.substr(0, props.startLength);
      const end = props.txHash.substr(-props.endLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, props.startLength, props.endLength]);

  const getUrl = useCallback(() => {
    if (props.realBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[currentChainId];
  }, [props.realBtc]);

  const [txHash, setTxHash] = useState(handleTx());
  const [url, setUrl] = useState(getUrl());
  const { chainId } = useContext(WalletContext);

  useEffect(() => {
    setTxHash(handleTx());
  }, [handleTx, props.txHash, props.startLength, props.endLength]);

  useEffect(() => {
    setUrl(getUrl());
  }, [chainId, getUrl]);

  return (
    <a
      className={props.className}
      href={`${url}/address/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {props.text ? props.text : txHash}
    </a>
  );
}

AddressBadge.defaultProps = {
  startLength: 10,
  endLength: 4,
  className: 'tw-ml-1 tw-text-sov-white',
};
