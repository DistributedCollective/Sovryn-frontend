import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { IAssets, IAssetData } from './types';
import { IPairData } from 'types/trading-pairs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { numberToUSD, toNumberFormat } from 'utils/display-text/format';
import { ReactComponent as ArrowDown } from 'assets/images/trend-arrow-down.svg';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { Icon, Popover } from '@blueprintjs/core';
import { LoadableValue } from 'app/components/LoadableValue';
import { Trans } from 'react-i18next';
import { usePairList } from 'app/hooks/trading/usePairList';
import { contractReader } from 'utils/sovryn/contract-reader';
import { fromWei } from 'utils/blockchain/math-helpers';

interface ICryptocurrencyPricesProps {
  pairs: IPairData[];
  isLoading: boolean;
  assetData?: IAssets;
  assetLoading: boolean;
}

export const CryptocurrencyPrices: React.FC<ICryptocurrencyPricesProps> = ({
  pairs,
  assetData,
  isLoading,
  assetLoading,
}) => {
  const { t } = useTranslation();

  const list = usePairList(pairs);

  const [zusdTotalSupply, setZusdTotalSupply] = React.useState('');

  useEffect(() => {
    const getTotalZusdSupply = async () => {
      const totalSupply = contractReader.call<string>(
        'ZUSD_token',
        'totalSupply',
        [],
      );
      return totalSupply;
    };

    if (!zusdTotalSupply) {
      getTotalZusdSupply().then(setZusdTotalSupply);
    }
  }, [zusdTotalSupply]);

  const rows = useMemo(() => {
    if (!isLoading && !list.length) {
      return [];
    }

    return list
      .map(pair => {
        const assetDetails = AssetsDictionary.getByTokenContractAddress(
          pair.base_id,
        );
        if (!assetDetails) {
          return [];
        }

        const result = [
          {
            assetDetails: assetDetails,
            price24h: Number(pair.price_change_percent_24h_usd),
            priceWeek: Number(pair.price_change_week_usd),
            lastPrice: Number(pair.last_price_usd),
            assetData: assetData && assetData[pair?.base_id],
          },
        ];

        if (assetDetails.asset === Asset.USDT) {
          const rbtcDetails = AssetsDictionary.getByTokenContractAddress(
            pair.quote_id,
          );
          result.push({
            assetDetails: rbtcDetails,
            price24h: -Number(pair.price_change_percent_24h),
            priceWeek: -Number(pair.price_change_week),
            lastPrice: Number(1 / pair.last_price),
            assetData: assetData && assetData[pair?.quote_id],
          });
        }

        if (assetDetails.asset === Asset.DLLR) {
          const zusdDetails = AssetsDictionary.get(Asset.ZUSD);
          result.push({
            assetDetails: zusdDetails,
            price24h: Number(pair.price_change_percent_24h_usd),
            priceWeek: Number(pair.price_change_week_usd),
            lastPrice: Number(pair.last_price_usd),
            assetData: assetData && {
              ...assetData[pair?.base_id],
              circulating_supply:
                Number(fromWei(zusdTotalSupply)) ||
                assetData[pair?.base_id]?.circulating_supply,
            },
          });
        }

        return result;
      })
      .flat()
      .map(pair => {
        const marketCap = bignumber(
          pair.assetData?.circulating_supply || '0',
        ).mul(pair.lastPrice || '0');
        return {
          ...pair,
          marketCap,
        };
      })
      .sort((pairA, pairB) =>
        pairA.marketCap.greaterThan(pairB.marketCap) ? -1 : 1,
      );
  }, [assetData, isLoading, list, zusdTotalSupply]);

  if (!isLoading && !list.length) {
    return null;
  }

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

            <th className="tw-text-right">
              <div className="tw-inline-flex tw-items-center">
                {t(translations.landingPage.cryptocurrencyPrices.marketCap)}

                <Popover
                  content={
                    <div className="tw-px-12 tw-py-8 tw-font-normal">
                      <Trans
                        i18nKey={
                          translations.landingPage.cryptocurrencyPrices
                            .marketCapTooltip
                        }
                        components={[<strong className="tw-font-bold" />]}
                      />
                    </div>
                  }
                  className="tw-pl-2"
                  popoverClassName={'tw-w-1/2 tw-transform tw-translate-x-full'}
                >
                  <Icon className="tw-cursor-pointer" icon={'info-sign'} />
                </Popover>
              </div>
            </th>

            <th className="tw-text-right">
              {t(
                translations.landingPage.cryptocurrencyPrices.circulatingSupply,
              )}
              <Popover
                content={
                  <div className="tw-px-12 tw-py-8 tw-font-normal">
                    <Trans
                      i18nKey={
                        translations.landingPage.cryptocurrencyPrices
                          .circulatingSupplyTooltip
                      }
                      components={[<strong className="tw-font-bold" />]}
                    />
                  </div>
                }
                className="tw-pl-2"
                popoverClassName={'tw-w-1/2 tw-transform tw-translate-x-full'}
              >
                <Icon className="tw-cursor-pointer" icon={'info-sign'} />
              </Popover>
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

          {rows.map(
            ({
              assetDetails,
              price24h,
              priceWeek,
              lastPrice,
              assetData,
              marketCap,
            }) => (
              <Row
                assetDetails={assetDetails}
                price24h={price24h}
                priceWeek={priceWeek}
                lastPrice={lastPrice}
                assetData={assetData}
                assetLoading={assetLoading}
                marketCap={marketCap.toNumber()}
                key={assetDetails.getTokenContractAddress()}
              />
            ),
          )}
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
  marketCap: number;
  assetLoading: boolean;
}

export const Row: React.FC<IRowProps> = ({
  assetData,
  assetDetails,
  price24h,
  priceWeek,
  lastPrice,
  assetLoading,
  marketCap,
}) => {
  if (!assetDetails) return <></>;

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
          {numberToUSD(lastPrice || 0)}
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={price24h} />
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <PriceChange value={priceWeek} />
        </td>

        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <LoadableValue
            loading={assetLoading}
            value={
              assetData?.circulating_supply
                ? `${numberToUSD(marketCap, 0)}`
                : ''
            }
          />
        </td>
        <td className={'tw-text-right tw-whitespace-nowrap'}>
          <LoadableValue
            loading={assetLoading}
            value={
              assetData?.circulating_supply
                ? toNumberFormat(assetData?.circulating_supply || 0, 2)
                : ''
            }
          />
        </td>
      </tr>
    </>
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
      className={classNames('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-trade-short': value < 0 && !noChange,
        'tw-text-trade-long': value > 0 && !noChange,
      })}
    >
      {numberString}%
      {!noChange && (
        <ArrowDown
          color={value > 0 ? 'tw-text-trade-long' : 'tw-text-trade-short'}
          className={classNames('tw-w-3 tw-ml-2', {
            'tw-transform tw-rotate-180': value > 0,
          })}
        />
      )}
    </div>
  );
};
