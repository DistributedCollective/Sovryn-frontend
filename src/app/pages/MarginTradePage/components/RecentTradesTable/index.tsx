import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMargin_RecentTradesTable } from '../../hooks/useMargin_RecentTradesTable';
import styles from './index.module.scss';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { TradingPair } from 'utils/models/trading-pair';

type RecentTradesTableProps = {
  pair: TradingPair;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const data = useMargin_RecentTradesTable();
  const { t } = useTranslation();
  return (
    <table className={styles.recentTradesTable}>
      <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
        <tr>
          <th colSpan={4}>
            <div className="tw-mb-2 tw-font-medium tw-w-full tw-text-sm tw-px-2 tw-pb-1 tw-border-b tw-border-sov-white">
              {t(translations.marginTradePage.recentTrades.title)} (
              {pair.chartSymbol})
            </div>
          </th>
        </tr>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.marginTradePage.recentTrades.price}
              components={[
                <AssetSymbolRenderer assetString={pair.longAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
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
          data.map((item, index) => (
            <RecentTradesTableRow
              key={item.id}
              row={item}
              isOddRow={index % 2 === 0}
            />
          ))}
      </tbody>
    </table>
  );
};
