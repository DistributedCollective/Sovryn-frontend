import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ReactComponent as TrendArrowUp } from 'assets/images/trend-arrow-up.svg';
import { ReactComponent as TrendArrowDown } from 'assets/images/trend-arrow-down.svg';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { usePerpetual_AmmDepthChart } from '../../hooks/usePerpetual_AmmDepthChart';
import { Tooltip } from '@blueprintjs/core';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { TradePriceChange } from '../RecentTradesTable/types';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { AmmDepthChartRow } from './AmmDepthChartRow';

type AmmDepthChartProps = {
  pair: PerpetualPair;
};

export const AmmDepthChart: React.FC<AmmDepthChartProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_AmmDepthChart(pair);
  const { maxTotal, trendImage, trendClass } = useMemo(() => {
    let max = 0;
    let trendImage: JSX.Element | undefined = undefined;
    let trendClass: string = 'tw-text-sov-white';

    if (data) {
      max = data.shorts.reduce(
        (acc, entry) => Math.max(acc, entry.amount),
        max,
      );
      max = data.longs.reduce((acc, entry) => Math.max(acc, entry.amount), max);
      switch (data.trend) {
        case TradePriceChange.UP:
          trendImage = (
            <TrendArrowUp
              color="tw-text-trade-long"
              className="tw-inline-block tw-w-4"
            />
          );
          trendClass = 'tw-text-trade-long';
          break;
        case TradePriceChange.DOWN:
          trendImage = (
            <TrendArrowDown
              color="tw-text-trade-short"
              className="tw-inline-block tw-w-4"
            />
          );
          trendClass = 'tw-text-trade-short';
          break;
        case TradePriceChange.NO_CHANGE:
          trendImage = undefined;
          trendClass = 'tw-text-sov-white';
          break;
      }
    }

    return { maxTotal: max, trendImage, trendClass };
  }, [data]);

  return (
    <table className="tw-w-full tw-h-full tw-text-xs tw-leading-snug">
      <thead>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-px-2 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            <Trans
              i18nKey={translations.perpetualPage.ammDepth.price}
              components={[
                <AssetSymbolRenderer assetString={pair.quoteAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-px-2 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            <Tooltip
              position="bottom"
              popoverClassName="tw-max-w-md tw-font-light"
              content={t(translations.perpetualPage.ammDepth.tooltips.change)}
            >
              <Trans i18nKey={translations.perpetualPage.ammDepth.change} />
            </Tooltip>
          </th>
          <th className="tw-h-6 tw-px-2 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            <Trans
              i18nKey={translations.perpetualPage.ammDepth.total}
              components={[
                <AssetSymbolRenderer assetString={pair.baseAsset} />,
              ]}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {data && (
          <>
            {data?.shorts?.map(entry => (
              <AmmDepthChartRow
                key={entry.id}
                type="short"
                row={entry}
                maxTotal={maxTotal}
              />
            ))}
            <tr>
              <td colSpan={3} className="tw-p-2 tw-text-center">
                <Tooltip
                  position="bottom"
                  content={
                    <Trans
                      i18nKey={
                        translations.perpetualPage.ammDepth.tooltips.midPrice
                      }
                      components={[
                        <AssetValue
                          value={data.price}
                          assetString={pair.quoteAsset}
                          minDecimals={2}
                          maxDecimals={4}
                          mode={AssetValueMode.auto}
                        />,
                      ]}
                    />
                  }
                >
                  <div
                    className={classNames(
                      'tw-flex tw-justify-center tw-text-xl tw-font-semibold ',
                      trendClass,
                    )}
                  >
                    {toNumberFormat(data.price, 2)}
                    {trendImage && (
                      <div className="tw-ml-1 tw-flex tw-items-center">
                        {trendImage}
                      </div>
                    )}
                  </div>
                </Tooltip>
                <div>
                  <Tooltip
                    popoverClassName="tw-max-w-md tw-font-medium"
                    position="bottom"
                    content={
                      <>
                        <Trans
                          i18nKey={
                            translations.perpetualPage.ammDepth.tooltips
                              .indexPrice
                          }
                          components={[
                            <AssetValue
                              value={data.indexPrice}
                              assetString={pair.quoteAsset}
                              minDecimals={2}
                              maxDecimals={4}
                              mode={AssetValueMode.auto}
                            />,
                          ]}
                        />
                        <p className="tw-mt-4 tw-mb-0 tw-font-light">
                          {t(
                            translations.perpetualPage.ammDepth.tooltips
                              .indexPriceDescription,
                          )}
                        </p>
                      </>
                    }
                  >
                    <span className="tw-opacity-50">
                      {toNumberFormat(data.indexPrice, 2)}
                    </span>
                  </Tooltip>
                  {' / '}
                  <Tooltip
                    popoverClassName="tw-max-w-md tw-font-medium"
                    position="bottom"
                    content={
                      <>
                        <Trans
                          i18nKey={
                            translations.perpetualPage.ammDepth.tooltips
                              .markPrice
                          }
                          components={[
                            <AssetValue
                              value={data.markPrice}
                              assetString={pair.quoteAsset}
                              minDecimals={2}
                              maxDecimals={4}
                              mode={AssetValueMode.auto}
                            />,
                          ]}
                        />
                        <p className="tw-mt-4 tw-mb-0 tw-font-light">
                          {t(
                            translations.perpetualPage.ammDepth.tooltips
                              .markPriceDescription,
                          )}
                        </p>
                      </>
                    }
                  >
                    {toNumberFormat(data.markPrice, 2)}
                  </Tooltip>
                </div>
              </td>
            </tr>
            {data?.longs?.map(entry => (
              <AmmDepthChartRow
                key={entry.id}
                type="long"
                row={entry}
                maxTotal={maxTotal}
              />
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};
