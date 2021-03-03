import React from 'react';
import { Tooltip } from '@blueprintjs/core';
import { weiTo18, weiToFixed } from '../../../utils/blockchain/math-helpers';

interface Props {
  label: React.ReactNode;
  value: string;
  decimals: number;
}

export function EthKeyValue({ label, value, decimals }: Props) {
  return (
    <>
      <div className="tw-font-bold">{label}</div>
      <Tooltip content={weiTo18(value)}>
        <div>{weiToFixed(value, decimals)}</div>
      </Tooltip>
    </>
  );
}

EthKeyValue.defaultProps = {
  decimals: 4,
};
