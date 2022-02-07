import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { IPairs, TradingType } from 'types/trading-pairs';

interface IPairLabelsProps {
  onChangeCategory: (value: string) => void;
  category: string;
  pairs: IPairs;
  type: string;
}

export const PairLabels: React.FC<IPairLabelsProps> = ({
  onChangeCategory,
  category,
  pairs,
  type,
}) => {
  const { t } = useTranslation();
  const ALL = t(translations.pairNavbar.all);
  //getting a list with currency labels
  const list = useMemo(() => {
    if (!pairs) {
      return [];
    }
    return Object.keys(pairs)
      .map(key => pairs[key].base_symbol)
      .filter(pair => pair);
  }, [pairs]);

  if (!list.length) {
    return null;
  }

  const categories = type === TradingType.SPOT ? [ALL, 'RBTC', ...list] : [ALL];

  return (
    <>
      {list &&
        categories.map(currency => {
          return (
            <div
              className={classNames(
                'tw-mr-4 tw-cursor-pointer tw-font-semibold tw-transition-opacity hover:tw-text-opacity-75 hover:tw-text-primary',
                {
                  'tw-text-primary':
                    category === currency ||
                    (category === '' && currency === ALL),
                  'tw-text-opacity-25':
                    category !== currency && currency !== ALL,
                },
              )}
              key={currency}
              onClick={() => onChangeCategory(currency === ALL ? '' : currency)}
            >
              {currency}
            </div>
          );
        })}
    </>
  );
};
