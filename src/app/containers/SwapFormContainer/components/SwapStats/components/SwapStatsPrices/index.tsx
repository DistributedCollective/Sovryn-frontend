import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { translations } from 'locales/i18n';
import {
  IPairs,
  IAssets,
  IAssetData,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { numberToUSD, toNumberFormat } from 'utils/display-text/format';
import arrowUp from 'assets/images/trend-arrow-up.svg';
import arrowDown from 'assets/images/trend-arrow-down.svg';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';

interface ISwapStatsPricesProps {
  pairs?: IPairs;
  isLoading: boolean;
  assetData?: IAssets;
  assetLoading: boolean;
}

export const SwapStatsPrices: React.FC<ISwapStatsPricesProps> = ({
  pairs,
  assetData,
  isLoading,
  assetLoading,
}) => {
  const { t } = useTranslation();

  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key])
      .filter(pair => {
        return pair;
      });
  }, [pairs]);

  if (!isLoading && !list.length) return null;

  return (
    <>
      {isLoading && (
        <div className="tw-skeleton tw-w-full" key={'loading'}>
          {t(translations.topUpHistory.loading)}
        </div>
      )}

      {!isLoading &&
        list.map(pair => {
          const assetDetails = AssetsDictionary.getByTokenContractAddress(
            pair.base_id,
          );
          if (!assetDetails) {
            return <></>;
          }
          let rbtcDiv;

          if (assetDetails.asset === Asset.USDT) {
            const rbtcDetails = AssetsDictionary.getByTokenContractAddress(
              pair.quote_id,
            );
            rbtcDiv = (
              <Div
                assetDetails={rbtcDetails}
                price24h={-pair.price_change_percent_24h}
                lastPrice={1 / pair.last_price}
                assetData={assetData && assetData[pair?.quote_id]}
                assetLoading={assetLoading}
              />
            );
          }

          return (
            <React.Fragment key={pair.base_id}>
              {rbtcDiv}
              <Div
                assetDetails={assetDetails}
                price24h={pair.price_change_percent_24h_usd}
                lastPrice={pair.last_price_usd}
                assetData={assetData && assetData[pair?.base_id]}
                assetLoading={assetLoading}
              />
            </React.Fragment>
          );
        })}
    </>
  );
};

interface IDivProps {
  assetData?: IAssetData;
  assetDetails?: AssetDetails;
  price24h: number;
  lastPrice: number;
  assetLoading: boolean;
}

export const Div: React.FC<IDivProps> = ({
  assetDetails,
  price24h,
  lastPrice,
}) => {
  if (!assetDetails) return <></>;

  return (
    <div className="tw-flex tw-items-center tw-mx-2">
      <div className="tw-text-left tw-whitespace-nowrap tw-min-w-16 tw-mr-1">
        <img
          className="tw-inline"
          style={{ width: '24px' }}
          src={assetDetails.logoSvg}
          alt={assetDetails.symbol}
        />
        <strong className="tw-ml-2">
          <AssetSymbolRenderer asset={assetDetails.asset} />
        </strong>
      </div>

      <div className="tw-text-right tw-whitespace-nowrap tw-mx-1">
        {numberToUSD(lastPrice || 0)}
      </div>

      <div className={'tw-text-right tw-whitespace-nowrap'}>
        <PriceChange value={price24h} />
      </div>
    </div>
  );
};

interface IPriceChangeProps {
  value: number;
}

export const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  let numberString = toNumberFormat(value || 0, 2);
  numberString =
    numberString === '0.00' || numberString === '-0.00' ? '0' : numberString;
  const noChange = numberString === '0';

  return (
    <div
      className={cn('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-trade-short': value < 0 && !noChange,
        'tw-text-trade-long': value > 0 && !noChange,
      })}
    >
      {numberString}%
      {value > 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowUp} alt={'up'} />
      )}
      {value < 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowDown} alt={'down'} />
      )}
    </div>
  );
};
