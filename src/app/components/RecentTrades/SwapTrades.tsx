import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core/lib/esm/components';
import { useSwap_RecentTrades } from 'app/hooks/trading/useSwap_RecentTrades';
import { RecentSwapRow } from './RecentSwapRow';
import { Asset } from 'types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

interface ISwapTradesProps {
  baseToken: Asset;
  quoteToken: Asset;
}

export const SwapTrades: React.FC<ISwapTradesProps> = ({
  baseToken,
  quoteToken,
}) => {
  const { t } = useTranslation();
  const assets = useMemo(() => {
    let base: Asset = baseToken,
      quote: Asset = quoteToken,
      isPool = true;
    if (![baseToken, quoteToken].includes(Asset.RBTC)) {
      base = baseToken;
      quote = Asset.RBTC;
      isPool = false;
    }
    return { base, quote, isPool };
  }, [baseToken, quoteToken]);

  const assetDetails = useMemo(() => {
    const base = AssetsDictionary.get(assets.base);
    const quote = AssetsDictionary.get(assets.quote);
    return { base, quote };
  }, [assets.base, assets.quote]);

  const data = useSwap_RecentTrades(assets.quote, assets.base);

  return (
    <table className="tw-w-full">
      <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
        <tr>
          <th colSpan={4}>
            <div className="tw-mb-3 tw-font-medium tw-w-full tw-text-sm tw-px-4 tw-pb-0 tw-border-b tw-border-sov-white">
              {assets.isPool && (
                <>
                  {`${t(translations.spotTradingPage.recentTrades.title)} `}
                  (<AssetRenderer asset={assets.base} />/
                  <AssetRenderer asset={assets.quote} />)
                </>
              )}
              {!assets.isPool && (
                <Tooltip
                  position="top"
                  interactionKind="hover"
                  content={
                    <>
                      <Trans
                        i18nKey={
                          translations.spotTradingPage.recentTrades.titleAMMInfo
                        }
                        components={[
                          <AssetRenderer asset={assets.base} />,
                          <AssetRenderer asset={assets.quote} />,
                        ]}
                      />
                    </>
                  }
                >
                  <>
                    {`${t(translations.spotTradingPage.recentTrades.title)} `}
                    (<AssetRenderer asset={assets.base} />/
                    <AssetRenderer asset={assets.quote} />
                    )*
                  </>
                </Tooltip>
              )}
            </div>
          </th>
        </tr>
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pl-2 tw-pb-1 tw-text-left tw-whitespace-nowrap">
            {t(translations.spotTradingPage.recentTrades.price)} (
            <AssetRenderer asset={assets.quote} />)
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-0 tw-pb-1 tw-text-right tw-whitespace-nowrap">
            {t(translations.spotTradingPage.recentTrades.size)} (
            <AssetRenderer asset={assets.base} />)
          </th>
          <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right">
            {t(translations.spotTradingPage.recentTrades.time)}
          </th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((item, index) => {
            return (
              <RecentSwapRow
                key={index}
                row={item}
                isOddRow={index % 2 === 0}
                baseAssetDetails={assetDetails.base}
                quoteAssetDetails={assetDetails.quote}
              />
            );
          })}

        {!data ||
          (data.length === 0 && (
            <tr>
              <td colSpan={4}>
                <p className="tw-p-4">
                  {t(translations.spotTradingPage.recentTrades.noTrades)}
                </p>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
