import React, { useState, useMemo } from 'react';
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
import { fromWei } from 'web3-utils';
import { ActionButton } from 'app/components/Form/ActionButton';
import { translations } from 'locales/i18n';
import { TableTransactionStatus } from 'app/components/FinanceV2Components/TableTransactionStatus';
import { TxStatus } from 'store/global/transactions-store/types';
import { CloseLimitPositionDialog } from '../CloseLimitPositionDialog';
import { TradeDialogInfo } from '../../TradeDialog/TradeDialogInfo';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { bignumber } from 'mathjs';
import { MarginLimitOrderList } from '../LimitOrderTables';
interface IOpenPositionRowProps extends MarginLimitOrderList {
  pending?: boolean;
}

export const OpenPositionRow: React.FC<IOpenPositionRowProps> = ({
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
}) => {
  const { t } = useTranslation();
  const [showClosePosition, setShowClosePosition] = useState(false);
  const { checkMaintenances, States } = useMaintenance();
  const { [States.CLOSE_SPOT_LIMIT]: closeTradesLocked } = checkMaintenances();

  const tradeAmount = useMemo(
    () =>
      loanTokenSent.toString() !== '0'
        ? loanTokenSent.toString()
        : collateralTokenSent.toString(),
    [loanTokenSent, collateralTokenSent],
  );
  const loanToken = pair?.getAssetForPosition(position);

  const entryPrice = useMemo(() => fromWei(minEntryPrice.toString()), [
    minEntryPrice,
  ]);

  const minEntry = useMemo(() => {
    if (pair?.longAsset === loanToken) {
      if (!entryPrice || Number(entryPrice) === 0) return '';
      return bignumber(1).div(entryPrice).toFixed(8);
    }
    return entryPrice;
  }, [entryPrice, loanToken, pair?.longAsset]);

  if (!pair) return null;

  return (
    <tr>
      <td>
        <DisplayDate timestamp={createdTimestamp.getTime().toString()} />
      </td>

      <td className="tw-w-full">
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-w-full tw-hidden xl:tw-table-cell">
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

      <td className="tw-w-full">
        {weiToNumberFormat(tradeAmount, 6)} ({leverage}x){' '}
        <AssetRenderer asset={collateralAsset} />
      </td>

      <td>
        <DisplayDate timestamp={deadline.getTime().toString()} />
      </td>

      <td>
        <div className="tw-flex tw-items-center">
          {!pending && (
            <ActionButton
              text={t(translations.openPositionTable.cta.close)}
              onClick={() => setShowClosePosition(true)}
              className={`tw-border-none tw-ml-0 tw-pl-0 ${
                closeTradesLocked && 'tw-cursor-not-allowed'
              }`}
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={closeTradesLocked}
              title={
                (closeTradesLocked &&
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
    </tr>
  );
};
