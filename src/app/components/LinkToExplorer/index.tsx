import React, { useMemo } from 'react';
import { ChainId } from 'types';
import { blockExplorers, currentChainId } from '../../../utils/classifiers';

interface LinkToExplorerProps {
  txHash: string;
  startLength?: number;
  endLength?: number;
  className?: string;
  chainId?: number | ChainId;
  realBtc?: boolean;
  text?: string;
  isAddress?: boolean;
}

export const LinkToExplorer: React.FC<LinkToExplorerProps> = ({
  startLength = 10,
  endLength = 4,
  className = 'tw-ml-1 tw-text-sov-white',
  ...props
}) => {
  const txHash = useMemo(() => {
    if (props.txHash?.length && startLength && endLength) {
      const start = props.txHash.substr(0, startLength);
      const end = props.txHash.substr(-endLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, startLength, endLength]);

  const url = useMemo(() => {
    if (props.realBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[props.chainId || currentChainId];
  }, [props.realBtc, props.chainId]);

  return (
    <a
      className={className}
      href={
        props.isAddress
          ? `${url}/address/${props.txHash}`
          : `${url}/tx/${props.txHash}`
      }
      target="_blank"
      rel="noreferrer noopener"
    >
      {props.text ? props.text : txHash}
    </a>
  );
};

LinkToExplorer.defaultProps = {
  startLength: 10,
  endLength: 4,
  className: 'tw-ml-1 tw-text-sov-white',
};
