import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { LoadableValue } from 'app/components/LoadableValue';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';
import { getOrder, TradingTypes } from 'app/pages/SpotTradingPage/types';
import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TxStatus } from 'store/global/transactions-store/types';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { weiToUSD } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';

interface Data {
  status: TxStatus;
  timestamp: number;
  transaction_hash: string;
  returnVal: {
    _fromAmount: string;
    _toAmount: string;
  };
}

interface IAssetRowProps {
  data: Data;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
}

export const AssetRow: React.FC<IAssetRowProps> = ({
  data,
  itemFrom,
  itemTo,
}) => {
  const { t } = useTranslation();

  const [dollarValue, dollarsLoading] = useGetProfitDollarValue(
    itemTo.asset,
    data.returnVal._toAmount,
  );

  const order = getOrder(itemFrom.asset, itemTo.asset);

  if (!order) {
    return null;
  }

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
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
        {numberFromWei(data.returnVal._fromAmount)}{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <div>{numberFromWei(data.returnVal._toAmount)}</div>≈{' '}
        <LoadableValue value={weiToUSD(dollarValue)} loading={dollarsLoading} />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-p-0">
          <div className="tw-w-32">
            {!data.status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {data.status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {data.status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
              txHash={data.transaction_hash}
              startLength={5}
              endLength={5}
            />
          </div>
          <div className="tw-hidden 2xl:tw-block">
            {!data.status && (
              <img
                src={iconSuccess}
                title={t(translations.common.confirmed)}
                alt={t(translations.common.confirmed)}
              />
            )}
            {data.status === TxStatus.FAILED && (
              <img
                src={iconRejected}
                title={t(translations.common.failed)}
                alt={t(translations.common.failed)}
              />
            )}
            {data.status === TxStatus.PENDING && (
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
