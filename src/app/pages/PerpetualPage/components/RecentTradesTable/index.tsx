import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React, { useContext } from 'react';
import { Trans } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { RecentTradesContext } from '../../contexts/RecentTradesContext';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';

type RecentTradesTableProps = {
  pair: PerpetualPair;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const { trades } = useContext(RecentTradesContext);
  const { lotPrecision } = useContext(PerpetualQueriesContext);

  return (
    <div className="tw-relative tw-w-full tw-min-w-80 tw-h-full">
      <table className="tw-scrollbars-thin tw-absolute tw-inset-0 tw-text-xs tw-leading-tight tw-overflow-y-scroll tw-block">
        <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
          <tr>
            <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
              <Trans
                i18nKey={translations.perpetualPage.recentTrades.price}
                components={[
                  <AssetSymbolRenderer assetString={pair.quoteAsset} />,
                ]}
              />
            </th>
            <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
              <Trans
                i18nKey={translations.perpetualPage.recentTrades.size}
                components={[
                  <AssetSymbolRenderer assetString={pair.baseAsset} />,
                ]}
              />
            </th>
            <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right">
              <Trans
                i18nKey={translations.perpetualPage.recentTrades.time}
                components={[
                  <AssetSymbolRenderer assetString={pair.baseAsset} />,
                ]}
              />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {trades &&
            trades.map((item, index) => (
              <RecentTradesTableRow
                key={item.id}
                row={item}
                isOddRow={index % 2 === 0}
                pricePrecision={2}
                sizePrecision={lotPrecision}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};
