import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { TradingPosition } from 'types/trading-position';
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
interface IOpenPositionRowProps {
  item: MarginLimitOrder;
  pending?: boolean;
}

export const OpenPositionRow: React.FC<IOpenPositionRowProps> = ({
  item,
  pending,
}) => {
  const { t } = useTranslation();
  const [showClosePosition, setShowClosePosition] = useState(false);
  const { checkMaintenances, States } = useMaintenance();
  const { [States.CLOSE_SPOT_LIMIT]: closeTradesLocked } = checkMaintenances();

  const loanAsset = assetByTokenAddress(item.loanTokenAddress);
  const collateralAsset = assetByTokenAddress(item.collateralTokenAddress);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const leverage = useMemo(
    () => Number(fromWei(item.leverageAmount.toString())) + 1,
    [item.leverageAmount],
  );

  const entryPrice = useMemo(() => fromWei(item.minEntryPrice.toString()), [
    item.minEntryPrice,
  ]);

  const tradeAmount = useMemo(
    () =>
      item.loanTokenSent.toString() !== '0'
        ? item.loanTokenSent.toString()
        : item.collateralTokenSent.toString(),
    [item.loanTokenSent, item.collateralTokenSent],
  );

  if (!pair) return null;

  const borrowToken = pair.getBorrowAssetForPosition(position);

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={new Date(item.createdTimestamp.toNumber())
            .getTime()
            .toString()}
        />
      </td>

      <td className="tw-w-full">
        <PositionBlock position={position} name={pair.name} />
      </td>
      <td className="tw-w-full tw-hidden xl:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          <Tooltip
            content={
              <>
                {toNumberFormat(entryPrice, 18)}{' '}
                <AssetRenderer asset={borrowToken} />
              </>
            }
          >
            <>
              {toAssetNumberFormat(entryPrice, borrowToken)}{' '}
              <AssetRenderer asset={borrowToken} />
            </>
          </Tooltip>
        </div>
      </td>

      <td className="tw-w-full">
        {weiToNumberFormat(tradeAmount, 6)} ({leverage}x){' '}
        <AssetRenderer asset={collateralAsset} />
      </td>

      <td>
        <DisplayDate
          timestamp={new Date(item.deadline.toNumber()).getTime().toString()}
        />
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
          order={item}
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
            minEntryPrice={toNumberFormat(entryPrice, 4)}
            borrowToken={borrowToken}
            useLoanTokens
          />
        </CloseLimitPositionDialog>
      </td>
    </tr>
  );
};
