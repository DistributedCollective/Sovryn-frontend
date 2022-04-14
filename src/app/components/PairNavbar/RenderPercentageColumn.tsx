import classNames from 'classnames';
import React, { useMemo, useCallback } from 'react';
import { ITradingPairs } from 'types/trading-pairs';
import { toNumberFormat } from 'utils/display-text/format';
import { getPercent } from './utils';

type RenderPercentageColumnProps = {
  pair: ITradingPairs;
  onPairChange: (pair: ITradingPairs) => void;
};

export const RenderPercentageColumn: React.FC<RenderPercentageColumnProps> = ({
  pair,
  onPairChange,
}) => {
  const value = useMemo(() => getPercent(pair[0], pair[1], pair[2]), [pair]);
  const handleOnClick = useCallback(() => onPairChange(pair), [
    onPairChange,
    pair,
  ]);

  return (
    <td
      className={classNames('tw-text-right tw-pr-5', {
        'tw-text-trade-long': value > 0,
        'tw-text-trade-short': value < 0,
      })}
      onClick={handleOnClick}
    >
      {value > 0 && <>+</>}
      {toNumberFormat(value, value !== 0 ? 6 : 0)}%
    </td>
  );
};
