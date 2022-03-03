import classNames from 'classnames';
import React, { useCallback, useContext, useMemo } from 'react';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { RecentTradesContext } from '../../contexts/RecentTradesContext';
import { getMarkPrice } from '../../utils/perpUtils';
import { TradePriceChange } from '../RecentTradesTable/types';
import { getPriceColor } from '../RecentTradesTable/utils';

type PairSelectorButtonProps = {
  pair: PerpetualPair;
  isSelected: boolean;
  onSelect: (pair: PerpetualPairType) => void;
};

export const PairSelectorButton: React.FC<PairSelectorButtonProps> = ({
  pair,
  isSelected,
  onSelect,
}) => {
  const { trades } = useContext(RecentTradesContext);
  const { ammState } = useContext(PerpetualQueriesContext);

  const markPrice = getMarkPrice(ammState);

  const trend = trades[0]?.priceChange || TradePriceChange.NO_CHANGE;
  const color = useMemo(() => getPriceColor(trend), [trend]);

  const onClick = useCallback(() => !isSelected && onSelect(pair.pairType), [
    onSelect,
    pair,
    isSelected,
  ]);

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-min-w-56 tw-px-3 tw-py-1.5 tw-mr-2 tw-rounded-lg tw-select-none tw-transition-colors tw-duration-300',
        isSelected
          ? 'tw-bg-gray-5'
          : 'tw-bg-gray-4 tw-cursor-pointer hover:tw-bg-gray-5',
      )}
      onClick={onClick}
    >
      <span className="tw-font-medium tw-mr-2 tw-text-xs">{pair.name}</span>
      <span
        className={classNames(
          'tw-flex-auto tw-text-right tw-font-medium tw-text-base',
          color,
        )}
      >
        {toNumberFormat(markPrice, 2)}
      </span>
    </div>
  );
};
