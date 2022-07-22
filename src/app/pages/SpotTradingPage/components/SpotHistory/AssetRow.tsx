import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { LoadableValue } from 'app/components/LoadableValue';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';
import { getOrder, TradingTypes } from 'app/pages/SpotTradingPage/types';
import { translations } from 'locales/i18n';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TxStatus } from 'store/global/transactions-store/types';
import { toNumberFormat } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { AssetValue } from 'app/components/AssetValue';
import { Nullable } from 'types';

interface IAssetRowProps {
  status?: TxStatus;
  timestamp: number;
  transactionHash: string;
  fromAmount: string;
  toAmount: Nullable<string>;
  assetFrom: AssetDetails;
  assetTo: AssetDetails;
}

export const AssetRow: React.FC<IAssetRowProps> = ({
  status,
  timestamp,
  transactionHash,
  fromAmount,
  toAmount,
  assetFrom,
  assetTo,
}) => {
  const { t } = useTranslation();

  const [dollarValue, dollarsLoading] = useGetProfitDollarValue(
    assetTo.asset,
    toAmount || '0',
  );

  const order = useMemo(() => getOrder(assetFrom.asset, assetTo.asset), [
    assetFrom,
    assetTo,
  ]);

  if (!order) {
    return null;
  }

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate timestamp={new Date(timestamp).getTime().toString()} />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <AssetRenderer asset={order.pairAsset[0]} />-
        <AssetRenderer asset={order.pairAsset[1]} />
      </td>
      <td className="tw-font-bold">
        <span
          className={
            order.orderType === TradingTypes.BUY
              ? 'tw-text-trade-long'
              : 'tw-text-trade-short'
          }
        >
          {order.orderType === TradingTypes.BUY
            ? t(translations.spotTradingPage.tradeForm.buy)
            : t(translations.spotTradingPage.tradeForm.sell)}
        </span>
      </td>
      <td>
        <AssetValue
          value={Number(fromAmount)}
          minDecimals={4}
          asset={assetFrom.asset}
        />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <AssetValue value={Number(toAmount || 0)} asset={assetTo.asset} />
        <br />≈{' '}
        <LoadableValue
          value={`USD ${toNumberFormat(dollarValue, 2)}`}
          loading={dollarsLoading}
        />
      </td>

      <td>
        <div className="tw-flex tw-items-center tw-p-0">
          <div className="tw-w-32">
            {!status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
              txHash={transactionHash}
              startLength={5}
              endLength={5}
            />
          </div>
          <div className="tw-hidden 2xl:tw-block">
            {!status && (
              <img
                src={iconSuccess}
                title={t(translations.common.confirmed)}
                alt={t(translations.common.confirmed)}
              />
            )}
            {status === TxStatus.FAILED && (
              <img
                src={iconRejected}
                title={t(translations.common.failed)}
                alt={t(translations.common.failed)}
              />
            )}
            {status === TxStatus.PENDING && (
              <img
                src={iconPending}
                title={t(translations.common.pending)}
                alt={t(translations.common.pending)}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
