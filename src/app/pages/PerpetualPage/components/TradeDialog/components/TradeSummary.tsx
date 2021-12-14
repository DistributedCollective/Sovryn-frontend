import React, { useMemo, useContext } from 'react';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import classNames from 'classnames';
import styles from '../index.module.scss';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { toNumberFormat } from '../../../../../../utils/display-text/format';
import { PerpetualPair } from '../../../../../../utils/models/perpetual-pair';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PerpetualTradeType,
} from '../../../types';
import {
  Transaction,
  TxType,
  TxStatus,
} from '../../../../../../store/global/transactions-store/types';
import { LinkToExplorer } from '../../../../../components/LinkToExplorer';
import { TxStatusIcon } from '../../../../../components/Dialogs/TxDialog';
import { RecentTradesContext } from '../../../contexts/RecentTradesContext';
import { RecentTradesDataEntry } from '../../RecentTradesTable/types';
import { TradeAnalysis } from '../types';

const TxTypeLabels = {
  [TxType.APPROVE]: translations.perpetualPage.processTrade.labels.approvalTx,
  [TxType.OPEN_PERPETUAL_TRADE]:
    translations.perpetualPage.processTrade.labels.tradeTx,
  [TxType.DEPOSIT_COLLATERAL]:
    translations.perpetualPage.processTrade.labels.marginTx,
  [TxType.WITHDRAW_COLLATERAL]:
    translations.perpetualPage.processTrade.labels.marginTx,
};

type TradeSummaryProps = {
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  pair: PerpetualPair;
  analysis: TradeAnalysis;
  transactions?: Transaction[];
};

export const TradeSummary: React.FC<TradeSummaryProps> = ({
  origin = PerpetualPageModals.NONE,
  trade,
  pair,
  analysis,
  transactions,
}) => {
  const {
    amountChange,
    marginChange,
    partialUnrealizedPnL,
    leverageTarget,
    limitPrice,
    tradingFee,
  } = analysis;

  const { t } = useTranslation();
  const { trades } = useContext(RecentTradesContext);

  const {
    title,
    showMarginText,
    showAmountText,
    showCloseText,
    isBuy,
  } = useMemo(() => {
    switch (origin) {
      case PerpetualPageModals.CLOSE_POSITION:
        return {
          title: `${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${t(translations.perpetualPage.reviewTrade.close)}`,
          showAmountText: true,
          showCloseText: true,
          isBuy: amountChange > 0,
        };
      case PerpetualPageModals.EDIT_LEVERAGE:
        return {
          title: `${t(
            translations.perpetualPage.reviewTrade.leverage,
          )} ${toNumberFormat(leverageTarget, 2)}x`,
          showMarginText: true,
          isBuy: marginChange > 0,
        };
      case PerpetualPageModals.EDIT_MARGIN:
        return {
          title: `${
            marginChange > 0
              ? t(translations.perpetualPage.reviewTrade.deposit)
              : t(translations.perpetualPage.reviewTrade.withdraw)
          } ${t(translations.perpetualPage.reviewTrade.margin)}`,
          showMarginText: true,
          isBuy: marginChange > 0,
        };
      case PerpetualPageModals.EDIT_POSITION_SIZE:
        return {
          title: `${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: true,
          isBuy: amountChange > 0,
        };
      default:
        return {
          title: `${toNumberFormat(leverageTarget, 2)}x ${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: true,
          isBuy: amountChange > 0,
        };
    }
  }, [t, origin, marginChange, amountChange, leverageTarget, trade?.tradeType]);

  const totalToReceive = -marginChange + partialUnrealizedPnL;

  return (
    <>
      <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl">
        <div
          className={classNames(
            'tw-text-xl tw-font-semibold tw-tracking-normal',
            isBuy ? styles.orderActionBuy : styles.orderActionSell,
          )}
        >
          {title}
        </div>
        {showMarginText && (
          <div className="tw-text-base tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-white tw-font-medium">
            {marginChange > 0
              ? t(translations.perpetualPage.reviewTrade.deposit)
              : t(translations.perpetualPage.reviewTrade.withdraw)}{' '}
            {toNumberFormat(Math.abs(marginChange), 4)} {pair.baseAsset}
          </div>
        )}
        {showAmountText && (
          <div className="tw-text-sm tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-wThite tw-font-medium">
            {toNumberFormat(Math.abs(amountChange), 3)} {pair.baseAsset} @{' '}
            {isBuy ? '≤' : '≥'} {toNumberFormat(limitPrice, 2)}{' '}
            {pair.quoteAsset}
          </div>
        )}
        {showCloseText && (
          <div className="tw-flex tw-justify-center tw-w-full tw-mt-2 tw-text-sm">
            <span className="tw-text-gray-10 tw-mr-2">
              {t(translations.perpetualPage.reviewTrade.labels.totalToReceive)}
            </span>
            <AssetValue
              className={classNames(
                'tw-text-sov-white tw-font-medium',
                totalToReceive > 0
                  ? 'tw-text-trade-long'
                  : 'tw-text-trade-short',
              )}
              minDecimals={4}
              maxDecimals={4}
              mode={AssetValueMode.auto}
              value={totalToReceive}
              assetString={pair.baseAsset}
              showPositiveSign
            />
          </div>
        )}
      </div>

      <div className="tw-flex tw-flex-col tw-items-between tw-w-full tw-py-4 tw-px-6 tw-mt-4 tw-text-sm tw-leading-loose tw-bg-gray-2 tw-rounded-xl">
        <div className="tw-flex tw-w-full">
          <span className="tw-flex-auto tw-w-1/2 tw-text-left tw-text-gray-10">
            {t(translations.perpetualPage.tradeForm.labels.tradingFee)}
          </span>
          <span className="tw-text-sov-white tw-font-medium">
            <AssetValue
              minDecimals={0}
              maxDecimals={6}
              mode={AssetValueMode.auto}
              value={tradingFee}
              assetString={pair.baseAsset}
            />
          </span>
        </div>
        {transactions?.map(transaction => (
          <LabeledTransactionHash
            key={transaction.transactionHash}
            label={t(
              TxTypeLabels[transaction.type] ||
                translations.perpetualPage.processTrade.labels.tx,
            )}
            transaction={transaction}
            trade={trades.find(
              trade => trade.id === transaction.transactionHash,
            )}
          />
        ))}
      </div>
    </>
  );
};

type LabeledTransactionHashProps = {
  label: React.ReactNode;
  transaction: Transaction;
  trade?: RecentTradesDataEntry;
};

const LabeledTransactionHash: React.FC<LabeledTransactionHashProps> = ({
  label,
  transaction,
  trade,
}) => (
  <div className="tw-flex tw-flex-row tw-w-full tw-justify-start">
    <span className="tw-flex-auto tw-w-1/2 tw-text-left tw-text-gray-10">
      {label}
    </span>
    <span className="tw-flex-auto tw-text-sov-white tw-text-right tw-font-medium">
      {transaction.transactionHash && (
        <LinkToExplorer
          txHash={transaction.transactionHash}
          chainId={transaction.chainId}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
        />
      )}
    </span>
    {transaction.status !== TxStatus.NONE && (
      <TxStatusIcon
        className="tw-ml-2 tw-w-6 tw-h-6"
        status={trade ? TxStatus.CONFIRMED : transaction.status}
        isInline
      />
    )}
  </div>
);
