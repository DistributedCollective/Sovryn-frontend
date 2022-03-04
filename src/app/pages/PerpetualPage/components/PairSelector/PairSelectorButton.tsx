import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React, {
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { perpUtils } from '@sovryn/perpetual-swap';
import { TradePriceChange } from '../RecentTradesTable/types';
import { getPriceColor, getPriceChange } from '../RecentTradesTable/utils';
import { usePrevious } from '../../../../hooks/usePrevious';

const { getMarkPrice } = perpUtils;

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
  const { t } = useTranslation();
  const { ammState } = useContext(PerpetualQueriesContext);
  const [trend, setTrend] = useState<TradePriceChange>(
    TradePriceChange.NO_CHANGE,
  );

  const markPrice = getMarkPrice(ammState);
  const previousMarkPrice = usePrevious(markPrice);

  useEffect(() => {
    if (previousMarkPrice !== markPrice) {
      setTrend(getPriceChange(previousMarkPrice || markPrice, markPrice));
    }
  }, [previousMarkPrice, markPrice]);

  const color = useMemo(() => getPriceColor(trend), [trend]);

  const onClick = useCallback(() => !isSelected && onSelect(pair.pairType), [
    onSelect,
    pair,
    isSelected,
  ]);

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-min-w-56 tw-px-3 tw-py-1 tw-my-1 tw-mr-2 tw-rounded-lg tw-select-none tw-transition-colors tw-duration-300',
        isSelected
          ? 'tw-bg-gray-5'
          : 'tw-bg-gray-4 tw-cursor-pointer hover:tw-bg-gray-5',
      )}
      onClick={onClick}
    >
      <span className="tw-font-medium tw-mr-2 tw-text-base">{pair.name}</span>
      <div className="tw-flex-auto tw-flex tw-flex-col tw-justify-center tw-py-0.5 tw-text-right">
        <div className="tw-text-tiny tw-leading-none tw-text-gray-8 tw-font-thin">
          {t(translations.perpetualPage.pairSelector.markPrice)}
        </div>
        <span
          className={classNames(
            'tw-font-medium tw-text-sm tw-leading-none',
            color,
          )}
        >
          {toNumberFormat(markPrice, 2)}
        </span>
      </div>
    </div>
  );
};
