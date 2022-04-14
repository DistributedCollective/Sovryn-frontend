import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { IPairData } from 'types/trading-pairs';
import { usePairList } from 'app/hooks/trading/usePairList';

interface ISwapSelectorLabelsProps {
  onChangeCategory: (value: string) => void;
  category: string;
  pairs: IPairData[];
}

export const SwapSelectorLabels: React.FC<ISwapSelectorLabelsProps> = ({
  onChangeCategory,
  category,
  pairs,
}) => {
  const { t } = useTranslation();
  const ALL = t(translations.pairNavbar.asset);
  //getting a list with currency labels
  const list = usePairList(pairs);
  if (!list.length) {
    return null;
  }

  return (
    <>
      {list && (
        <div
          className={classNames(
            'tw-mr-4 tw-cursor-pointer tw-font-semibold tw-transition-opacity hover:tw-text-opacity-75 hover:tw-text-primary',
            {
              'tw-text-primary': category === '',
            },
          )}
          key={ALL}
          onClick={() => onChangeCategory(category !== ALL ? '' : ALL)}
        >
          {ALL}
        </div>
      )}
    </>
  );
};
