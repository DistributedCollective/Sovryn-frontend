import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { translations } from 'locales/i18n';
import { IPairs, IPairData } from './types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { toNumberFormat } from 'utils/display-text/format';
import arrowUp from 'assets/images/trend-arrow-up.svg';
import arrowDown from 'assets/images/trend-arrow-down.svg';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';

interface ICryptocurrencyPricesProps {
  pairs?: IPairs;
  isLoading: boolean;
}

export const CryptocurrencyPrices: React.FC<ICryptocurrencyPricesProps> = ({
  pairs,
  isLoading,
}) => {
  const { t } = useTranslation();

  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs).map(key => pairs[key]);
  }, [pairs]);

  if (!isLoading && !list.length) return null;

  return (
    <>
      <div className="tw-font-semibold tw-mb-8">
        {t(translations.landingPage.cryptocurrencyPrices.title)}
      </div>

      <table className="tw-w-full sovryn-table">
        <thead>
          <tr>
            <th className="tw-text-left tw-min-w-36">
              {t(translations.landingPage.cryptocurrencyPrices.asset)}
            </th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices.price)}
            </th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices['24h'])}
            </th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices['7d'])}
            </th>
          </tr>
        </thead>
        <tbody className="tw-mt-12">
          {isLoading && (
            <tr key={'loading'}>
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.loading)}
                />
              </td>
            </tr>
          )}

          {list.map(pair => (
            <Row pair={pair} key={pair.trading_pairs} />
          ))}
        </tbody>
      </table>
    </>
  );
};

interface IRowProps {
  pair: IPairData;
}

export const Row: React.FC<IRowProps> = ({ pair }) => {
  const assetDetails = AssetsDictionary.getByTokenContractAddress(pair.base_id);

  return (
    <>
      <tr>
        <td className="tw-text-left tw-whitespace-nowrap">
          <img
            className="tw-inline"
            style={{ width: '38px' }}
            src={assetDetails.logoSvg}
            alt={assetDetails.symbol}
          />
          <strong className="tw-ml-4">
            <AssetSymbolRenderer asset={assetDetails.asset} />
          </strong>
        </td>

        <td className="tw-text-right tw-whitespace-nowrap">
          {pair.last_price_usd?.toLocaleString('en', {
            maximumFractionDigits: 3,
            minimumFractionDigits: 2,
          })}{' '}
          USD
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={pair.price_change_percent_24h_usd} />
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={pair.price_change_week_usd} />
        </td>
      </tr>
    </>
  );
};

interface IPriceChangeProps {
  value: number;
}

export const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  return (
    <div
      className={cn('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-trade-short': value < 0,
        'tw-text-trade-long': value > 0,
      })}
    >
      {toNumberFormat(value, 2)}%
      {value > 0 && <img className="tw-w-3 tw-ml-2" src={arrowUp} alt={'up'} />}
      {value < 0 && (
        <img className="tw-w-3 tw-ml-2" src={arrowDown} alt={'down'} />
      )}
    </div>
  );
};
