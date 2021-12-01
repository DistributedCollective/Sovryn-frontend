import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React, { useContext, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import styles from './index.module.scss';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { RecentTradesContext } from './context';
import { usePerpetual_queryPerpParameters } from '../../hooks/usePerpetual_queryPerpParameters';

type RecentTradesTableProps = {
  pair: PerpetualPair;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const { trades } = useContext(RecentTradesContext);
  const perpParameters = usePerpetual_queryPerpParameters();
  const lotPrecision = useMemo(() => {
    const lotSize = Number(perpParameters.fLotSizeBC.toPrecision(8));
    const lotPrecision = lotSize.toString().split(/[,.]/)[1]?.length || 0;

    return lotPrecision;
  }, [perpParameters.fLotSizeBC]);

  return (
    <table className={styles.recentTradesTable}>
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
  );
};
