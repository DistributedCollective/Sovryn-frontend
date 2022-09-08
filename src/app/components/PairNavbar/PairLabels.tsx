import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import uniq from 'lodash.uniq';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { IPairData, TradingType } from 'types/trading-pairs';
import { Asset } from 'types';
import { Button, ButtonSize, ButtonStyle } from 'app/components/Button';
import { pairList, pairs } from 'app/pages/SpotTradingPage/types';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';

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

  //getting a list with currency labels
  const list = useMemo(() => {
    if (!spotPairs) {
      return [];
    }
    return Object.keys(spotPairs)
      .map(key => assetByTokenAddress(spotPairs[key].base_id))
      .filter(pair => pair);
  }, [spotPairs]);

  if (!list.length) {
    return null;
  }

  const spotPairsList = uniq(
    pairList.reduce((previous, current) => {
      const [assetA, assetB] = pairs[current];
      return [...previous, ...[assetA, assetB]];
    }, [] as string[]),
  );

  const labelsList = list
    .map(item => {
      if (spotPairsList.includes(item)) {
        return item;
      }
      return undefined;
    })
    .filter(item => item !== undefined);

  const categories =
    type === TradingType.SPOT ? [Asset.RBTC, ...labelsList] : null;

  return (
    <>
      <Button
        text={t(translations.pairNavbar.all)}
        className={classNames('tw-mr-4 tw-no-underline', {
          'tw-text-primary': category === '',
          'tw-text-sov-white': category !== '',
        })}
        size={ButtonSize.sm}
        style={ButtonStyle.link}
        onClick={() => onChangeCategory('')}
      />
      {categories &&
        categories.map(currency => {
          return (
            <Button
              text={<AssetSymbolRenderer asset={currency} />}
              className={classNames('tw-mr-4 tw-no-underline', {
                'tw-text-primary': category === currency,
                'tw-text-sov-white': category !== currency,
              })}
              size={ButtonSize.sm}
              style={ButtonStyle.link}
              key={currency}
              onClick={() => onChangeCategory(currency || '')}
            />
          );
        })}
    </>
  );
};
