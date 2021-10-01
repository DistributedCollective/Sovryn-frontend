import React, { useMemo } from 'react';
import { blockExplorers, currentChainId } from '../../../utils/classifiers';

interface Props {
  txHash: string;
  startLength: number;
  endLength: number;
  className: string;
  chainId?: number;
  realBtc?: boolean;
  text?: string;
}

export function LinkToExplorer(props: Props) {
  const txHash = useMemo(() => {
    if (props.txHash?.length && props.startLength && props.endLength) {
      const start = props.txHash.substr(0, props.startLength);
      const end = props.txHash.substr(-props.endLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, props.startLength, props.endLength]);

  const url = useMemo(() => {
    if (props.realBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[props.chainId || currentChainId];
  }, [props.realBtc, props.chainId]);

  return (
    <a
      className={props.className}
      href={`${url}/tx/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {props.text ? props.text : txHash}
    </a>
  );
}

LinkToExplorer.defaultProps = {
  startLength: 10,
  endLength: 4,
  className: 'tw-ml-1 tw-text-sov-white',
};
