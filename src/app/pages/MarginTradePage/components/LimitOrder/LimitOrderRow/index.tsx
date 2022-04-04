import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';

import { PositionBlock } from '../../PositionBlock';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Tooltip } from '@blueprintjs/core';
import { ActionButton } from 'app/components/Form/ActionButton';
import { translations } from 'locales/i18n';
import { TableTransactionStatus } from 'app/components/FinanceV2Components/TableTransactionStatus';
import { TxStatus } from 'store/global/transactions-store/types';
import { CloseLimitPositionDialog } from '../CloseLimitPositionDialog';
import { TradeDialogInfo } from '../../TradeDialog/TradeDialogInfo';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { MarginLimitOrderList } from '../LimitOrderTables';
import { useGetLimitOrderRow } from 'app/pages/MarginTradePage/hooks/useGetLimitOrderRow';
import { EventData } from 'web3-eth-contract';
import { LinkToExplorer } from 'app/components/LinkToExplorer';

interface ILimitOrderRowProps extends MarginLimitOrderList {
  pending?: boolean;
  orderFilledEvents?: EventData[];
}

export const LimitOrderRow: React.FC<ILimitOrderRowProps> = ({
  loanAsset,
  collateralAsset,
  pair,
  position,
  leverage,
  loanTokenSent,
  collateralTokenSent,
  minEntryPrice,
  createdTimestamp,
  deadline,
  pending,
  order,
  filledAmount,
  orderFilledEvents,
}) => {
  const { t } = useTranslation();
  const [showClosePosition, setShowClosePosition] = useState(false);
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_SPOT_LIMIT]: closeTradesLocked,
    [States.CLOSE_MARGIN_LIMIT]: closeLimitTradeLocked,
  } = checkMaintenances();
  const { tradeAmount, minEntry } = useGetLimitOrderRow(
    pair,
    position,
    loanTokenSent,
    collateralTokenSent,
    minEntryPrice,
  );

  const isOpenPosition = filledAmount === '0';

  const depositAsset = useMemo(
    () =>
      order.loanTokenSent.toString() !== '0' ? loanAsset : collateralAsset,
    [collateralAsset, loanAsset, order.loanTokenSent],
  );

  return (
    <tr>
      <td className="tw-hidden md:tw-table-cell">
        <DisplayDate timestamp={createdTimestamp.getTime().toString()} />
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        {order.transactionHash ? (
          <LinkToExplorer
            txHash={order.transactionHash}
            className="tw-truncate"
            chainId={31}
          />
        ) : (
          '-'
        )}
      </td>
      <td>
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <Tooltip
            content={
              <>
                {toNumberFormat(minEntry, 18)}{' '}
                <AssetRenderer asset={pair.longAsset} />
              </>
            }
          >
            <>
              {toAssetNumberFormat(minEntry, pair.longAsset)}{' '}
              <AssetRenderer asset={pair.longAsset} />
            </>
          </Tooltip>
        </div>
      </td>

      <td className="tw-hidden md:tw-table-cell">
        {weiToNumberFormat(tradeAmount, 6)} ({leverage}x){' '}
        <AssetRenderer asset={depositAsset} />
      </td>
      {!isOpenPosition && (
        <>
          <td className="tw-hidden sm:tw-table-cell">
            <DisplayDate timestamp={deadline.getTime().toString()} />
          </td>

          <td>
            {weiToNumberFormat(filledAmount, 6)}{' '}
            <AssetRenderer asset={depositAsset} />
          </td>
        </>
      )}
      {isOpenPosition && (
        <>
          <td className="tw-hidden sm:tw-table-cell">
            <DisplayDate timestamp={deadline.getTime().toString()} />
          </td>

          <td>
            <div className="tw-flex tw-items-center">
              {!pending && (
                <ActionButton
                  text={t(translations.openPositionTable.cta.close)}
                  onClick={() => setShowClosePosition(true)}
                  className={`tw-border-none tw-ml-0 tw-pl-0 ${
                    (closeTradesLocked || closeLimitTradeLocked) &&
                    'tw-cursor-not-allowed'
                  }`}
                  textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
                  disabled={closeTradesLocked || closeLimitTradeLocked}
                  title={
                    ((closeTradesLocked || closeLimitTradeLocked) &&
                      t(translations.maintenance.closeMarginTrades).replace(
                        /<\/?\d+>/g,
                        '',
                      )) ||
                    undefined
                  }
                />
              )}
              {pending && (
                <TableTransactionStatus transactionStatus={TxStatus.PENDING} />
              )}
            </div>
            <CloseLimitPositionDialog
              order={order}
              onCloseModal={() => setShowClosePosition(false)}
              showModal={showClosePosition}
              position={position}
            >
              <TradeDialogInfo
                position={position}
                leverage={leverage}
                orderTypeValue={OrderType.LIMIT}
                amount={tradeAmount}
                collateral={collateralAsset}
                loanToken={loanAsset}
                collateralToken={collateralAsset}
                minEntryPrice={toNumberFormat(minEntry, 6)}
                useLoanTokens
              />
            </CloseLimitPositionDialog>
          </td>
        </>
      )}
    </tr>
  );
};
