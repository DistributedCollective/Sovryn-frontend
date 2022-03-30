import React, { useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite, MAINTENANCE_MARGIN } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Dialog } from 'app/containers/Dialog';
import { TradingPosition } from 'types/trading-position';
import { selectMarginTradePage } from '../../../selectors';
import { actions } from '../../../slice';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { OrderType } from 'app/components/OrderTypeTitle/types';

import { useMarginLimitOrder } from 'app/hooks/limitOrder/useMarginLimitOrder';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { TxStatus } from 'store/global/transactions-store/types';
import { LimitResultDialog } from './LimitResultDialog';
import { TradeDialogInfo } from '../../TradeDialog/TradeDialogInfo';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { bignumber } from 'mathjs';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';

interface ILimitTradeDialogProps {
  isOpen: boolean;
  onCloseModal: () => void;
  orderType: OrderType;
  duration: number;
  minEntryPrice: string;
}

export const LimitTradeDialog: React.FC<ILimitTradeDialogProps> = ({
  isOpen,
  onCloseModal,
  orderType,
  duration,
  minEntryPrice,
}) => {
  const { t } = useTranslation();

  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );

  const [orderStatus, setOrderStatus] = useState(TxStatus.NONE);
  const [txHash, setTxHash] = useState('');

  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);

  const dispatch = useDispatch();
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);

  const onSuccess = useCallback(
    (order: MarginLimitOrder, data) => {
      setTxHash(data.hash);
      setOrderStatus(TxStatus.CONFIRMED);
      dispatch(actions.addPendingLimitOrders(order));
    },
    [dispatch],
  );

  const onError = () => {
    setOrderStatus(TxStatus.FAILED);
  };

  const onStart = () => {
    setOrderStatus(TxStatus.PENDING);
    onCloseModal();
  };

  const positionSize = useMemo(
    () => bignumber(amount).mul(leverage).toFixed(0),
    [amount, leverage],
  );

  const minEntry = useMemo(() => {
    if (pair.longAsset === loanToken) {
      if (!minEntryPrice || Number(minEntryPrice) === 0) {
        return '';
      }
      return bignumber(1).div(minEntryPrice).toFixed(18);
    }
    return minEntryPrice;
  }, [loanToken, minEntryPrice, pair.longAsset]);

  const { createOrder: createLimitOrder, ...tx } = useMarginLimitOrder(
    pair,
    position,
    collateral,
    leverage,
    amount,
    minEntry,
    duration,
    onSuccess,
    onError,
    onStart,
  );

  return (
    <>
      <Dialog
        dataAttribute="margin-limit-order"
        isOpen={isOpen}
        onClose={onCloseModal}
      >
        <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.marginTradePage.tradeDialog.title)}
          </h1>
          <TradeDialogInfo
            position={position}
            leverage={leverage}
            orderTypeValue={orderType}
            amount={amount}
            collateral={collateral}
            loanToken={loanToken}
            collateralToken={collateralToken}
            useLoanTokens={useLoanTokens}
            minEntryPrice={toNumberFormat(minEntryPrice, 6)}
          />
          <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(
                translations.marginTradePage.tradeDialog.maintananceMargin,
              )}
              value={<>{weiToNumberFormat(MAINTENANCE_MARGIN)} %</>}
            />
          </div>

          <p className="tw-text-center tw-text-sm tw-mt-3 tw-mb-2">
            {t(translations.marginTradePage.tradeDialog.newPositionDetails)}
          </p>
          <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-5 tw-mb-4 tw-rounded-lg tw-text-xs tw-font-light">
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.positionSize)}
              className={classNames({
                'tw-text-trade-short': position === TradingPosition.SHORT,
                'tw-text-trade-long': position === TradingPosition.LONG,
              })}
              value={
                <>
                  {weiToNumberFormat(positionSize, 8)}{' '}
                  <AssetRenderer asset={collateral} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.margin)}
              value={
                <>
                  {weiToNumberFormat(amount, 8)}{' '}
                  <AssetRenderer asset={collateral} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.leverage)}
              value={toNumberFormat(leverage) + 'x'}
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.minEntry)}
              value={
                <>
                  {toNumberFormat(minEntryPrice, 8)}{' '}
                  <AssetRenderer asset={pair.longAsset} />
                </>
              }
            />
          </div>

          <div className="tw-mt-4">
            {openTradesLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.openMarginTrades}
                    components={[
                      <a
                        href={discordInvite}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                      >
                        x
                      </a>,
                    ]}
                  />
                }
              />
            )}
          </div>

          <div className="tw-mw-340 tw-mx-auto">
            <DialogButton
              confirmLabel={t(translations.common.confirm)}
              onConfirm={createLimitOrder}
              disabled={openTradesLocked}
              data-action-id="margin-reviewTransaction-button-confirm"
            />
          </div>
        </div>
      </Dialog>
      <TransactionDialog tx={tx} />
      <LimitResultDialog
        isOpen={orderStatus !== TxStatus.NONE}
        onClose={() => setOrderStatus(TxStatus.NONE)}
        status={orderStatus}
        txHash={txHash}
      >
        <TradeDialogInfo
          position={position}
          leverage={leverage}
          orderTypeValue={orderType}
          amount={amount}
          collateral={collateral}
          loanToken={loanToken}
          collateralToken={collateralToken}
          useLoanTokens={useLoanTokens}
          minEntryPrice={toNumberFormat(minEntryPrice, 8)}
        />
      </LimitResultDialog>
    </>
  );
};
