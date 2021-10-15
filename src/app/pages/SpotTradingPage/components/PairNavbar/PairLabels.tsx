import React, { useMemo } from 'react';
import cn from 'classnames';
import { IPairs } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';

interface IPairLabelsProps {
  onChangeCategory: (value: string) => void;
  category: string;
  pairs: IPairs;
}

const ALL = 'ALL';

export const PairLabels: React.FC<IPairLabelsProps> = ({
  onChangeCategory,
  category,
  pairs,
}) => {
  //getting a list with currency labels
  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key].base_symbol)
      .filter(pair => pair);
  }, [pairs]);

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
