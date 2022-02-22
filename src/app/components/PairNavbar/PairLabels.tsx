import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { IPairData, TradingType } from 'types/trading-pairs';
import { Asset } from 'types';
import { pairList, pairs } from 'app/pages/SpotTradingPage/types';

interface IPairLabelsProps {
  onChangeCategory: (value: string) => void;
  category: string;
  pairs: IPairData[];
  type: string;
}

export const PairLabels: React.FC<IPairLabelsProps> = ({
  onChangeCategory,
  category,
  pairs: spotPairs,
  type,
}) => {
  const { t } = useTranslation();
  const ALL = t(translations.pairNavbar.all);
  //getting a list with currency labels
  const list = useMemo(() => {
    if (!spotPairs) {
      return [];
    }
    return Object.keys(spotPairs)
      .map(key => spotPairs[key].base_symbol)
      .filter(pair => pair);
  }, [spotPairs]);

  if (!list.length) {
    return null;
  }

  const spotPairsList = pairList.map(item => {
    const [assetA] = pairs[item];
    return assetA;
  });

  const labelsList = list
    .map(item => {
      if (spotPairsList.includes(item)) {
        return item;
      }
      return null;
    })
    .filter(item => item !== null);

  const categories =
    type === TradingType.SPOT ? [ALL, Asset.RBTC, ...labelsList] : [ALL];

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
