import React, { useContext, useMemo } from 'react';
import btcIcon from 'assets/images/tokens/rbtc.svg';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { RecentTradesContext } from '../RecentTradesTable/context';
import {
  getPriceColor,
  getPriceChange,
} from '../RecentTradesTable/components/RecentTablesRow/utils';
import { toNumberFormat } from '../../../../../utils/display-text/format';

type PairSelectorProps = {
  pair: PerpetualPair;
};

const PerpetualPairs = PerpetualPairDictionary.list();

export const PairSelector: React.FC<PairSelectorProps> = ({ pair }) => {
  return (
    <div className="tw-w-full tw-bg-gray-3">
      <div className="tw-container tw-flex tw-flex-row">
        <div className="tw-flex tw-flex-row tw-items-center tw-w-56 tw-px-3 tw-py-1.5">
          <img className="tw-w-auto tw-h-7 tw-mr-2" src={btcIcon} alt="BTC" />
          <span className="tw-font-bold tw-text-sm">BTC</span>
        </div>
        {PerpetualPairs.map(entry => (
          <PairSelectorButton
            key={entry.id}
            pair={entry}
            isSelected={pair.id === entry.id}
          />
        ))}
      </div>
    </div>
  );
};

type PairSelectorButtonProps = {
  pair: PerpetualPair;
  isSelected: boolean;
};

const PairSelectorButton: React.FC<PairSelectorButtonProps> = ({
  pair,
  isSelected,
}) => {
  const { trades } = useContext(RecentTradesContext);
  const latestPrice = trades[0]?.price;
  const previousPrice = trades[1]?.price;
  const color = useMemo(
    () =>
      getPriceColor(getPriceChange(previousPrice || latestPrice, latestPrice)),
    [previousPrice, latestPrice],
  );

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-min-w-56 tw-px-3 tw-py-1.5 tw-mr-2 tw-rounded-lg tw-select-none tw-transition-colors tw-duration-300',
        isSelected
          ? 'tw-bg-gray-5'
          : 'tw-bg-gray-4 tw-cursor-pointer hover:tw-bg-gray-5',
      )}
    >
      <span className="tw-font-medium tw-mr-2 tw-text-xs">
        {pair.name} ({pair.config.leverage.max}x)
      </span>
      <span
        className={classNames(
          'tw-flex-auto tw-text-right tw-font-medium tw-text-base',
          color,
        )}
      >
        {toNumberFormat(latestPrice, 1)}
      </span>
    </div>
  );
};
