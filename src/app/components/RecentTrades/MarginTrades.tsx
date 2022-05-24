import React from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { useMargin_RecentTrades } from 'app/hooks/trading/useMargin_RecentTrades';
import { RecentTradeRow } from './RecentTradeRow';
import { Asset } from 'types';
import { AssetRenderer } from 'app/components/AssetRenderer';

interface IMarginTradesProps {
  baseToken: Asset;
  quoteToken: Asset;
}

export const MarginTrades: React.FC<IMarginTradesProps> = ({
  baseToken,
  quoteToken,
}) => {
  const { t } = useTranslation();
  const { data, loading } = useMargin_RecentTrades(baseToken, quoteToken);

  return (
    <table className="tw-w-full">
      <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
        <tr>
          <th colSpan={4}>
            <div className="tw-mb-3 tw-font-medium tw-w-full tw-text-sm tw-px-4 tw-pb-0 tw-border-b tw-border-sov-white">
              {t(translations.marginTradePage.recentTrades.title)} (
              <AssetRenderer asset={baseToken} />/
              <AssetRenderer asset={quoteToken} />)
            </div>
          </th>
        </tr>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pl-2 tw-pb-1 tw-text-left tw-whitespace-nowrap">
            {t(translations.marginTradePage.recentTrades.price)} (
            <AssetRenderer asset={quoteToken} />)
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-0 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            {t(translations.marginTradePage.recentTrades.size)} (
            <AssetRenderer asset={baseToken} />)
          </th>
          <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right">
            {t(translations.marginTradePage.recentTrades.time)}
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {!loading &&
          data &&
          data.map((item, index) => {
            return (
              <RecentTradeRow
                key={index}
                row={item}
                isOddRow={index % 2 === 0}
                baseToken={baseToken}
                quoteToken={quoteToken}
              />
            );
          })}
        {!loading ||
          !data ||
          (data.length === 0 && (
            <tr>
              <td colSpan={4}>
                <p className="tw-p-4">
                  {t(translations.marginTradePage.recentTrades.noTrades)}
                </p>
              </td>
            </tr>
          ))}
        {loading && (
          <>
            {Array(15)
              .fill(1)
              .map((item, index) => (
                <tr className="tw-h-6" key={index}>
                  <td colSpan={4}>
                    <p className="tw-skeleton-wrapper bp3-skeleton tw-m-0 tw-p-3"></p>
                  </td>
                </tr>
              ))}
          </>
        )}
      </tbody>
    </table>
  );
};
