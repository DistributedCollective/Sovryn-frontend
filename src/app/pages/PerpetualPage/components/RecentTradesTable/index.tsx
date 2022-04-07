import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React, { useContext, useRef, useLayoutEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { RecentTradesContext } from '../../contexts/RecentTradesContext';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { usePerpetual_getCurrentPairId } from '../../hooks/usePerpetual_getCurrentPairId';

type RecentTradesTableProps = {
  pair: PerpetualPair;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const { trades } = useContext(RecentTradesContext);

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { lotPrecision } = perpetuals[currentPairId];

  const [style, setStyle] = useState<{ width: number }>();

  const ref = useRef<HTMLTableElement>(null);

  useLayoutEffect(() => {
    if (
      ref.current &&
      (!style || ref.current.scrollWidth + 10 !== style.width + 10)
    ) {
      setStyle({ width: ref.current.scrollWidth + 10 });
    }
    // only run when the table entries change
    // eslint-disable-next-line
  }, [trades, lotPrecision, pair]);

  return (
    <div className="tw-relative tw-flex-grow" style={style}>
      <table
        ref={ref}
        className="tw-scrollbars-thin tw-absolute tw-inset-0 tw-text-xs tw-leading-tight tw-overflow-y-scroll tw-block"
      >
        <thead className="tw-bg-gray-2.5 tw-sticky tw-top-0 tw-z-10">
          <tr>
            <th className="tw-h-6 tw-px-2 tw-pb-1 tw-text-right">
              <Trans
                i18nKey={translations.perpetualPage.recentTrades.price}
                components={[
                  <AssetSymbolRenderer assetString={pair.quoteAsset} />,
                ]}
              />
            </th>
            <th className="tw-h-6 tw-px-2 tw-pb-1 tw-text-right">
              <Trans
                i18nKey={translations.perpetualPage.recentTrades.size}
                components={[
                  <AssetSymbolRenderer assetString={pair.baseAsset} />,
                ]}
              />
            </th>
            <th className="tw-h-6 tw-px-2 tw-pb-1 tw-text-right">
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
            trades.map(item => (
              <RecentTradesTableRow
                key={item.id}
                row={item}
                pricePrecision={2}
                sizePrecision={lotPrecision}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};
