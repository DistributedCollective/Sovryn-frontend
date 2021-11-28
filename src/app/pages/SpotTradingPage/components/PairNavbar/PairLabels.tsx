import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { IPairs } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';

interface IPairLabelsProps {
  onChangeCategory: (value: string) => void;
  category: string;
  pairs: IPairs;
}

export const PairLabels: React.FC<IPairLabelsProps> = ({
  onChangeCategory,
  category,
  pairs,
}) => {
  const { t } = useTranslation();
  //getting a list with currency labels
  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key].base_symbol)
      .filter(pair => pair);
  }, [pairs]);

  const ALL = t(translations.spotTradingPage.pairNavbar.all);

  const categories = [ALL, 'RBTC', ...list];
  if (!list.length) return null;

  return (
    <>
      {list &&
        categories.map(currency => {
          return (
            <div
              className={cn(
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
