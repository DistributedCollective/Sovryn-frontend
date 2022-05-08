import React from 'react';
import classNames from 'classnames';
import {
  IAssets,
  IAssetData,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import { IPairData } from 'types/trading-pairs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { numberToUSD, toNumberFormat } from 'utils/display-text/format';
import { ReactComponent as ArrowUp } from 'assets/images/trend-arrow-up.svg';
import { ReactComponent as ArrowDown } from 'assets/images/trend-arrow-down.svg';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { usePairList } from 'app/hooks/trading/usePairList';
import styles from './index.module.scss';

interface ISwapStatsPricesProps {
  pairs: IPairData[];
  assetData?: IAssets;
}

export const SwapStatsPrices: React.FC<ISwapStatsPricesProps> = ({
  pairs,
  assetData,
}) => {
  const list = usePairList(pairs);

  if (!list.length) {
    return null;
  }

  return (
    <>
      {list.slice(0, 4).map(pair => {
        const assetDetails = AssetsDictionary.getByTokenContractAddress(
          pair.base_id,
        );
        if (!assetDetails) {
          return <></>;
        }
        let rbtcItem;

        if (assetDetails.asset === Asset.USDT) {
          const rbtcDetails = AssetsDictionary.getByTokenContractAddress(
            pair.quote_id,
          );
          rbtcItem = (
            <StatsItem
              assetDetails={rbtcDetails}
              price24h={-pair.price_change_percent_24h}
              lastPrice={1 / pair.last_price}
              assetData={assetData && assetData[pair?.quote_id]}
            />
          );
        }

        return (
          <React.Fragment key={pair.base_id}>
            {rbtcItem}
            <StatsItem
              assetDetails={assetDetails}
              price24h={pair.price_change_percent_24h_usd}
              lastPrice={pair.last_price_usd}
              assetData={assetData && assetData[pair?.base_id]}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

interface IStatsItemProps {
  assetData?: IAssetData;
  assetDetails?: AssetDetails;
  price24h: number;
  lastPrice: number;
}

const StatsItem: React.FC<IStatsItemProps> = ({
  assetDetails,
  price24h,
  lastPrice,
}) => {
  if (!assetDetails) {
    return null;
  }

  return (
    <div className="tw-flex tw-items-center tw-mx-2">
      <div className="tw-text-left tw-whitespace-nowrap tw-min-w-16 tw-mr-1">
        <img
          className="tw-inline tw-w-6"
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

const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  let numberString = toNumberFormat(value || 0, 2);
  numberString =
    numberString === '0.00' || numberString === '-0.00' ? '0' : numberString;
  const noChange = numberString === '0';

  return (
    <div
      className={classNames('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-trade-short': value < 0 && !noChange,
        'tw-text-trade-long': value > 0 && !noChange,
      })}
    >
      {numberString}%
      {value > 0 && !noChange && (
        <ArrowUp className={classNames('tw-w-3 tw-ml-2', styles.priceUp)} />
      )}
      {value < 0 && !noChange && (
        <ArrowDown className={classNames('tw-w-3 tw-ml-2', styles.priceDown)} />
      )}
    </div>
  );
};
