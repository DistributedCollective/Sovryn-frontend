import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import trendArrowUp from 'assets/images/trend-arrow-up.svg';
import trendArrowDown from 'assets/images/trend-arrow-down.svg';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import {
  AmmDepthChartDataEntry,
  usePerpetual_AmmDepthChart,
} from '../../hooks/usePerpetual_AmmDepthChart';
import { Tooltip } from '@blueprintjs/core';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { TradePriceChange } from '../RecentTradesTable/types';

type AmmDepthChartProps = {
  pair: PerpetualPair;
};

export const AmmDepthChart: React.FC<AmmDepthChartProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_AmmDepthChart(pair);
  const { maxTotal, trendImage, trendText, trendClass } = useMemo(() => {
    let max = 0;
    let trendImage: string | undefined = undefined;
    let trendText: string | undefined = undefined;
    let trendClass: string = 'tw-text-sov-white';

    if (data) {
      max = data.shorts.reduce(
        (acc, entry) => Math.max(acc, entry.amount),
        max,
      );
      max = data.longs.reduce((acc, entry) => Math.max(acc, entry.amount), max);
      switch (data.trend) {
        case TradePriceChange.UP:
          trendImage = trendArrowUp;
          trendText = 'trending upwards';
          trendClass = 'tw-text-trade-long';
          break;
        case TradePriceChange.DOWN:
          trendImage = trendArrowDown;
          trendText = 'trending downwards';
          trendClass = 'tw-text-trade-short';
          break;
        case TradePriceChange.NO_CHANGE:
          trendImage = undefined;
          trendText = 'trend stable';
          trendClass = 'tw-text-sov-white';
          break;
      }
    }

    return { maxTotal: max, trendImage, trendText, trendClass };
  }, [data]);

  return (
    <table className="tw-w-full tw-h-full tw-text-xs tw-leading-snug">
      <thead>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            <Trans
              i18nKey={translations.perpetualPage.ammDepth.price}
              components={[
                <AssetSymbolRenderer assetString={pair.quoteAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            <Trans i18nKey={translations.perpetualPage.ammDepth.change} />
          </th>
          <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right tw-whitespace-nowrap">
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
            {data?.shorts?.map((entry, index) => (
              <AmmDepthChartRow
                key={entry.id}
                type="short"
                row={entry}
                maxTotal={maxTotal}
                isOddRow={index % 2 === 0}
              />
            ))}
            <tr>
              <td
                colSpan={3}
                className="tw-p-2 tw-text-center tw-bg-gray-2 tw-rounded tw-transition-colors tw-duration-300"
              >
                <Tooltip
                  position="bottom"
                  hoverOpenDelay={0}
                  hoverCloseDelay={0}
                  interactionKind="hover"
                  content={
                    <>
                      {data.price}{' '}
                      <AssetSymbolRenderer assetString={pair.quoteAsset} />
                    </>
                  }
                >
                  <div
                    className={classNames(
                      'tw-flex tw-justify-center tw-text-xl tw-font-semibold ',
                      trendClass,
                    )}
                  >
                    {data.price.toFixed(2)}
                    {trendImage && (
                      <img
                        className="tw-inline-block tw-w-4 tw-ml-1"
                        src={trendImage}
                        alt={trendText}
                      />
                    )}
                  </div>
                </Tooltip>
                <div className="">
                  <Tooltip
                    position="bottom"
                    hoverOpenDelay={0}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    content={
                      <>
                        {t(translations.perpetualPage.ammDepth.indexPrice)}{' '}
                        {data.indexPrice}{' '}
                        <AssetSymbolRenderer assetString={pair.quoteAsset} />
                      </>
                    }
                  >
                    <span className="tw-opacity-50">
                      {data.indexPrice.toFixed(2)}
                    </span>
                  </Tooltip>
                  {' / '}
                  <Tooltip
                    position="bottom"
                    hoverOpenDelay={0}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    content={
                      <>
                        {t(translations.perpetualPage.ammDepth.markPrice)}{' '}
                        {data.markPrice}{' '}
                        <AssetSymbolRenderer assetString={pair.quoteAsset} />
                      </>
                    }
                  >
                    <span>{data.markPrice.toFixed(2)}</span>
                  </Tooltip>
                </div>
              </td>
            </tr>
            {data?.longs?.map((entry, index) => (
              <AmmDepthChartRow
                key={entry.id}
                type="long"
                row={entry}
                maxTotal={maxTotal}
                isOddRow={index % 2 === 0}
              />
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

type AmmDepthChartRowProps = {
  type: 'long' | 'short';
  row: AmmDepthChartDataEntry;
  isOddRow: boolean;
  maxTotal: number;
};

const AmmDepthChartRow: React.FC<AmmDepthChartRowProps> = ({
  type,
  row,
  maxTotal,
  isOddRow,
}) => {
  const backgroundClassName = isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1';

  return (
    <tr key={row.price}>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right tw-font-semibold tw-rounded-l',
          type === 'short' ? 'tw-text-trade-short' : 'tw-text-trade-long',
          backgroundClassName,
        )}
      >
        {toNumberFormat(row.price, 1)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {Math.abs(row.deviation).toPrecision(1)}%
      </td>
      <td
        className={classNames(
          'tw-relative tw-px-4 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
        )}
      >
        <span
          className={classNames(
            'tw-absolute tw-h-full tw-top-0 tw-left-0 tw-opacity-25 tw-rounded tw-transition-all tw-duration-300',
            type === 'short' ? 'tw-bg-trade-short' : 'tw-bg-trade-long',
          )}
          style={{ width: (row.amount / maxTotal) * 100 + '%' }}
        />
        <span className="tw-relative tw-z-10">
          {toNumberFormat(row.amount, 3)}
        </span>
      </td>
    </tr>
  );
};
