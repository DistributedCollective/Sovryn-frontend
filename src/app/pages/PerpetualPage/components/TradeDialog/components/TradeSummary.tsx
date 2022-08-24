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
  PerpetualTradeAnalysis,
} from '../../../types';
import {
  Transaction,
  TxType,
  TxStatus,
} from '../../../../../../store/global/transactions-store/types';
import { LinkToExplorer } from '../../../../../components/LinkToExplorer';
import { RecentTradesContext } from '../../../contexts/RecentTradesContext';
import { RecentTradesDataEntry } from '../../RecentTradesTable/types';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { StatusComponent } from 'app/components/Dialogs/StatusComponent';
import { PerpetualQueriesContext } from '../../../contexts/PerpetualQueriesContext';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';

const TxTypeLabels = {
  [TxType.APPROVE]: translations.perpetualPage.processTrade.labels.approvalTx,
  [TxType.PERPETUAL_TRADE]:
    translations.perpetualPage.processTrade.labels.tradeTx,
  [TxType.PERPETUAL_DEPOSIT_COLLATERAL]:
    translations.perpetualPage.processTrade.labels.marginTx,
  [TxType.PERPETUAL_WITHDRAW_COLLATERAL]:
    translations.perpetualPage.processTrade.labels.marginTx,
};

const TradeTypeLabels: Record<PerpetualTradeType, any> = {
  [PerpetualTradeType.MARKET]: translations.perpetualPage.reviewTrade.market,
  [PerpetualTradeType.LIMIT]: translations.perpetualPage.reviewTrade.limit,
  [PerpetualTradeType.STOP]: translations.perpetualPage.reviewTrade.stop,
  [PerpetualTradeType.LIQUIDATION]: undefined,
};

type TradeSummaryProps = {
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  pair: PerpetualPair;
  analysis: PerpetualTradeAnalysis;
  transactions?: Transaction[];
};

export const TradeSummary: React.FC<TradeSummaryProps> = ({
  origin = PerpetualPageModals.NONE,
  trade,
  pair: currentPair,
  analysis,
  transactions,
}) => {
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const pair = useMemo(
    () =>
      trade?.pairType
        ? PerpetualPairDictionary.get(trade?.pairType)
        : currentPair,
    [trade?.pairType, currentPair],
  );

  const { lotPrecision, perpetualParameters } = perpetuals[pair.id];

  const {
    amountChange,
    marginChange,
    partialUnrealizedPnL,
    leverageTarget,
    entryPrice,
    limitPrice,
    orderCost,
    tradingFee,
  } = analysis;

  const { t } = useTranslation();
  const { trades } = useContext(RecentTradesContext);

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const {
    title,
    showMarginText,
    showAmountText,
    showCloseText,
    showOrderText,
    isBuy,
  } = useMemo(() => {
    switch (origin) {
      case PerpetualPageModals.CLOSE_POSITION:
        return {
          title: `${t(
            TradeTypeLabels[trade?.tradeType || PerpetualTradeType.MARKET],
          )} ${t(translations.perpetualPage.reviewTrade.close)}`,
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
      case PerpetualPageModals.CANCEL_ORDER:
        return {
          title: `${t(translations.perpetualPage.reviewTrade.cancel)} ${t(
            TradeTypeLabels[trade?.tradeType || PerpetualTradeType.MARKET],
          )} ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showOrderText: true,
          isBuy: amountChange > 0,
        };
      case PerpetualPageModals.NONE:
        return {
          title: `${toNumberFormat(trade?.leverage || leverageTarget, 2)}x ${t(
            TradeTypeLabels[trade?.tradeType || PerpetualTradeType.MARKET],
          )} ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: trade?.tradeType === PerpetualTradeType.MARKET,
          showOrderText: trade?.tradeType !== PerpetualTradeType.MARKET,
          isBuy: amountChange > 0,
        };
      default:
        return {
          title: `${toNumberFormat(leverageTarget, 2)}x ${t(
            TradeTypeLabels[trade?.tradeType || PerpetualTradeType.MARKET],
          )} ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: true,
          isBuy: amountChange > 0,
        };
    }
  }, [
    origin,
    trade?.tradeType,
    trade?.leverage,
    t,
    amountChange,
    leverageTarget,
    marginChange,
  ]);

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
            {toNumberFormat(Math.abs(marginChange), 4)} {collateralName}
          </div>
        )}
        {showAmountText && (
          <div className="tw-text-sm tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-white tw-font-medium">
            {toNumberFormat(Math.abs(amountChange), lotPrecision)}{' '}
            {pair.baseAsset} @ {toNumberFormat(entryPrice, 2)} {pair.quoteAsset}
          </div>
        )}
        {showCloseText && (
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-mt-4 tw-text-sm">
            <div>
              <span className="tw-text-gray-10 tw-mr-2">
                {t(
                  translations.perpetualPage.reviewTrade.labels[
                    isBuy ? 'maxEntryPrice' : 'minEntryPrice'
                  ],
                )}
              </span>
              <span className="tw-text-sov-white">
                <AssetValue
                  className="tw-font-light"
                  assetClassName="tw-font-light"
                  value={limitPrice}
                  assetString={pair.quoteAsset}
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                />
              </span>
            </div>
            <div>
              <span className="tw-text-gray-10 tw-mr-2">
                {t(
                  translations.perpetualPage.reviewTrade.labels.totalToReceive,
                )}
              </span>
              <span
                className={classNames(
                  'tw-text-sov-white tw-font-medium',
                  totalToReceive > 0
                    ? 'tw-text-trade-long'
                    : 'tw-text-trade-short',
                )}
              >
                ≥
                <AssetValue
                  className="tw-ml-1"
                  minDecimals={4}
                  maxDecimals={4}
                  mode={AssetValueMode.auto}
                  value={totalToReceive}
                  assetString={collateralName}
                  showPositiveSign
                />
              </span>
            </div>
          </div>
        )}
        {showOrderText && (
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-mt-2 tw-text-sm">
            <div>
              <span className="tw-text-gray-10 tw-mr-2">
                {t(translations.perpetualPage.reviewTrade.labels.orderSize)}
              </span>
              <span className="tw-text-sov-white">
                <AssetValue
                  className="tw-font-light"
                  assetClassName="tw-font-light"
                  value={trade?.amount || '0'}
                  assetString={pair.baseAsset}
                  minDecimals={lotPrecision}
                  maxDecimals={lotPrecision}
                  mode={AssetValueMode.auto}
                />
              </span>
            </div>
            <div>
              <span className="tw-text-gray-10 tw-mr-2">
                {t(translations.perpetualPage.reviewTrade.labels.limitPrice)}
              </span>
              <span className="tw-text-sov-white">
                <AssetValue
                  className="tw-font-light"
                  assetClassName="tw-font-light"
                  value={trade?.limit || '0'}
                  assetString={pair.quoteAsset}
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                />
              </span>
            </div>
            {trade?.trigger && trade.trigger !== '0' && (
              <div>
                <span className="tw-text-gray-10 tw-mr-2">
                  {t(
                    translations.perpetualPage.reviewTrade.labels.triggerPrice,
                  )}
                </span>
                <span className="tw-text-sov-white">
                  <AssetValue
                    className="tw-font-light"
                    assetClassName="tw-font-light"
                    value={trade.trigger}
                    assetString={pair.quoteAsset}
                    minDecimals={2}
                    maxDecimals={2}
                    mode={AssetValueMode.auto}
                  />
                </span>
              </div>
            )}
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
              minDecimals={tradingFee === 0 ? 0 : 8}
              maxDecimals={8}
              mode={AssetValueMode.auto}
              value={tradingFee}
              assetString={collateralName}
            />
          </span>
        </div>
        {showOrderText && (
          <div className="tw-flex tw-w-full">
            <span className="tw-flex-auto tw-w-1/2 tw-text-left tw-text-gray-10">
              {t(translations.perpetualPage.tradeForm.labels.relayerFee)}
            </span>
            <span className="tw-text-sov-white tw-font-medium">
              <AssetValue
                minDecimals={8}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                value={perpetualParameters.fReferralRebateCC}
                assetString={collateralName}
              />
            </span>
          </div>
        )}
        {marginChange > 0 && (
          <div className="tw-flex tw-w-full">
            <span className="tw-flex-auto tw-w-1/2 tw-text-left tw-text-gray-10">
              {t(translations.perpetualPage.tradeForm.labels.orderCost)}
            </span>
            <span className="tw-text-sov-white tw-font-medium">
              <AssetValue
                minDecimals={8}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                value={orderCost}
                assetString={collateralName}
              />
            </span>
          </div>
        )}
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
      <StatusComponent
        className="tw-ml-2 tw-w-6 tw-h-6"
        status={trade ? TxStatus.CONFIRMED : transaction.status}
        isInline
      />
    )}
  </div>
);
