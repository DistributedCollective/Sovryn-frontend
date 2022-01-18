import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMargin_RecentTradesTable } from '../../hooks/useMargin_RecentTradesTable';
import styles from './index.module.scss';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { TradingPair } from 'utils/models/trading-pair';
import { TradePriceChange } from './types';
import { bignumber } from 'mathjs';

type RecentTradesTableProps = {
  pair: TradingPair;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const data = useMargin_RecentTradesTable(pair);
  const { t } = useTranslation();
  const quoteToken = pair.longDetails.tokenContract.address;
  let currentItemEntryPrice = '0';

  return (
    <table className={styles.recentTradesTable}>
      <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
        <tr>
          <th colSpan={4}>
            <div className="tw-mb-3 tw-font-medium tw-w-full tw-text-sm tw-px-4 tw-pb-0 tw-border-b tw-border-sov-white">
              {t(translations.marginTradePage.recentTrades.title)} (
              {pair.chartSymbol})
            </div>
          </th>
        </tr>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pl-4 tw-pb-1 tw-text-left">
            <Trans
              i18nKey={translations.marginTradePage.recentTrades.price}
              components={[
                <AssetSymbolRenderer assetString={pair.longAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-0 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.marginTradePage.recentTrades.size}
              components={[
                <AssetSymbolRenderer assetString={pair.shortAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.marginTradePage.recentTrades.time}
              components={[<AssetSymbolRenderer assetString={pair.pairType} />]}
            />
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {data &&
          data.length > 0 &&
          data.map((item, index) => {
            let randomNumber = bignumber(item.entryPrice).lessThan(
              currentItemEntryPrice,
            )
              ? 0
              : 1;
            if (bignumber(item.entryPrice).equals(currentItemEntryPrice))
              randomNumber = 2;

            const getPriceChange = () => {
              switch (randomNumber) {
                case 0:
                  return TradePriceChange.DOWN;
                case 1:
                  return TradePriceChange.UP;
                default:
                  return TradePriceChange.NO_CHANGE;
              }
            };

            currentItemEntryPrice = item.entryPrice;

            return (
              <RecentTradesTableRow
                key={index}
                row={item}
                isOddRow={index % 2 === 0}
                quoteToken={quoteToken}
                priceChange={getPriceChange()}
              />
            );
          })}

        {!data ||
          (data.length === 0 && (
            <tr>
              <td colSpan={4}>
                <p className="tw-p-4">
                  {t(translations.marginTradePage.recentTrades.noTrades)}
                </p>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
