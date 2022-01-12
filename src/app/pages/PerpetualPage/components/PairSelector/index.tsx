import React, { useContext, useMemo, useCallback } from 'react';
import btcIcon from 'assets/images/tokens/rbtc.svg';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { getPriceColor, getPriceChange } from '../RecentTradesTable/utils';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { RecentTradesContext } from '../../contexts/RecentTradesContext';
import { Switch } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

type PairSelectorProps = {
  pair: PerpetualPair;
};

const perpetualPairs = PerpetualPairDictionary.list();

export const PairSelector: React.FC<PairSelectorProps> = ({ pair }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { useMetaTransactions } = useSelector(selectPerpetualPage);

  const onToggleMetaTransactions = useCallback(
    () => dispatch(actions.setUseMetaTransactions(!useMetaTransactions)),
    [dispatch, useMetaTransactions],
  );

  return (
    <div className="tw-w-full tw-bg-gray-3">
      <div className="tw-container tw-flex tw-flex-row">
        <div className="tw-flex tw-flex-row tw-items-center tw-w-56 tw-px-4 tw-py-1.5">
          <img className="tw-w-auto tw-h-7 tw-mr-2" src={btcIcon} alt="BTC" />
          <span className="tw-font-bold tw-text-sm">BTC</span>
        </div>
        <div className="tw-flex tw-flex-row tw-items-center tw-flex-1">
          {perpetualPairs.map(entry => (
            <PairSelectorButton
              key={entry.id}
              pair={entry}
              isSelected={pair.id === entry.id}
            />
          ))}
        </div>
        <div className="tw-flex tw-flex-row tw-items-center">
          <Switch
            className="tw-mb-0"
            large
            label={t(
              translations.perpetualPage.pairSelector.useMetaTransaction,
            )}
            checked={useMetaTransactions}
            onChange={onToggleMetaTransactions}
          />
        </div>
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
