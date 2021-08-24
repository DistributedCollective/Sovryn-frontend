import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { translations } from 'locales/i18n';
import { IPairs, IAssets, IAssetData } from './types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { toNumberFormat } from 'utils/display-text/format';
import arrowUp from 'assets/images/Icon_feather-arrow-up.svg';
import arrowDown from 'assets/images/Icon_feather-arrow-down.svg';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';

interface ICryptocurrencyPricesProps {
  pairs?: IPairs;
  isLoading: boolean;
  assetData?: IAssets;
  assetLoading: boolean;
}

export const CryptocurrencyPrices: React.FC<ICryptocurrencyPricesProps> = ({
  pairs,
  assetData,
  isLoading,
}) => {
  const { t } = useTranslation();

  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key])
      .filter(pair => pair);
  }, [pairs]);

  if (!isLoading && !list.length) return null;

  return (
    <>
      <div className="tw-font-semibold tw-mb-8">
        {t(translations.landingPage.cryptocurrencyPrices.title)}
      </div>

      <table className="tw-w-full sovryn-table tw-min-w-150">
        <thead>
          <tr>
            <th>{t(translations.landingPage.cryptocurrencyPrices.asset)}</th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices.price)}
            </th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices['24h'])}
            </th>
            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices['7d'])}
            </th>

            <th className="tw-text-right">
              {t(translations.landingPage.cryptocurrencyPrices.marketCap)}
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

          {list.map(pair => {
            const assetDetails = AssetsDictionary.getByTokenContractAddress(
              pair.base_id,
            );
            let rbtcRow;

            if (assetDetails.asset === Asset.USDT) {
              const rbtcDetails = AssetsDictionary.getByTokenContractAddress(
                pair.quote_id,
              );
              rbtcRow = (
                <Row
                  key={pair.quote_id}
                  assetDetails={rbtcDetails}
                  price24h={1 / pair.price_change_percent_24h}
                  priceWeek={1 / pair.price_change_week}
                  lastPrice={1 / pair.last_price}
                  assetData={assetData && assetData[pair?.quote_id]}
                />
              );
            }

            return (
              <>
                {rbtcRow}
                <Row
                  key={pair.base_id}
                  assetDetails={assetDetails}
                  price24h={pair.price_change_percent_24h_usd}
                  priceWeek={pair.price_change_week_usd}
                  lastPrice={pair.last_price_usd}
                  assetData={assetData && assetData[pair?.base_id]}
                />
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

interface IRowProps {
  assetData?: IAssetData;
  assetDetails?: AssetDetails;
  price24h: number;
  priceWeek: number;
  lastPrice: number;
}

export const Row: React.FC<IRowProps> = ({
  assetData,
  assetDetails,
  price24h,
  priceWeek,
  lastPrice,
}) => {
  if (!assetDetails) return null;

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
          {lastPrice?.toLocaleString('en', {
            maximumFractionDigits: 3,
            minimumFractionDigits: 2,
          })}{' '}
          USD
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={price24h} />
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={priceWeek} />
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          {assetData?.circulating_supply
            ? Number(
                bignumber(assetData?.circulating_supply)
                  .mul(lastPrice)
                  .toFixed(0),
              ).toLocaleString('en')
            : ''}

          {}
        </td>
      </tr>
    </>
  );
};

interface IPriceChangeProps {
  value: number;
}

export const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  const number = toNumberFormat(value, 2);
  const noChange = number === '0.00';
  return (
    <div
      className={cn('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-red_light': value < 0 && !noChange,
        'tw-text-green_light': value > 0 && !noChange,
      })}
    >
      {number}%
      {value > 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowUp} alt={'up'} />
      )}
      {value < 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowDown} alt={'down'} />
      )}
    </div>
  );
};
