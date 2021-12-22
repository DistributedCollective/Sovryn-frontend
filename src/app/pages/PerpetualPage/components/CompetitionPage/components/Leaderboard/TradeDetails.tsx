import React from 'react';
import { toNumberFormat } from 'utils/display-text/format';

interface ITradeDetailsProps {
  value: string;
  pair: string;
}

export const TradeDetails: React.FC<ITradeDetailsProps> = ({ value, pair }) => {
  return (
    <>
      {!value ? (
        '-'
      ) : (
        <>
          {pair}:{' '}
          <span className="tw-text-orange-2">{toNumberFormat(value, 2)}%</span>
        </>
      )}
    </>
  );
};
