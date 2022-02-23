import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { HashZero } from '@ethersproject/constants';
import { Checkbox } from '@blueprintjs/core';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useMaintenance } from 'app/hooks/useMaintenance';
import {
  discordInvite,
  TRADE_LOG_SIGNATURE_HASH,
  useTenderlySimulator,
  MAINTENANCE_MARGIN,
} from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import {
  getContract,
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import {
  toNumberFormat,
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Dialog } from 'app/containers/Dialog';
import { useApproveAndTrade } from 'app/hooks/trading/useApproveAndTrade';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { useAccount } from 'app/hooks/useAccount';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { TradingPosition } from 'types/trading-position';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { TradeDialogInfo } from './TradeDialogInfo';
import { TradeToastInfo } from './TradeToastInfo';
import { Toast } from 'app/components/Toast';
import {
  SimulationStatus,
  useFilterSimulatorResponseLogs,
} from 'app/hooks/simulator/useFilterSimulatorResponseLogs';
import { TradeEventData } from 'types/active-loan';
import { useSimulator } from 'app/hooks/simulator/useSimulator';
import { bignumber } from 'mathjs';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import {
  totalDeposit,
  _getMarginBorrowAmountAndRate,
} from './trading-dialog.helpers';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { LoadableValue } from 'app/components/LoadableValue';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { useGetEstimatedMarginDetails } from 'app/hooks/trading/useGetEstimatedMarginDetails';

interface ITradeDialogProps {
  slippage: number;
  isOpen: boolean;
  onCloseModal: () => void;
  orderType: OrderType;
}

const TradeLogInputs = [
  {
    indexed: true,
    internalType: 'address',
    name: 'user',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'lender',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'bytes32',
    name: 'loanId',
    type: 'bytes32',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'collateralToken',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'loanToken',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'positionSize',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'borrowedAmount',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'interestRate',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'settlementDate',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'entryPrice',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'entryLeverage',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'currentLeverage',
    type: 'uint256',
  },
];

export const TradeDialog: React.FC<ITradeDialogProps> = ({
  slippage,
  isOpen,
  onCloseModal,
  orderType,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const dispatch = useDispatch();
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const [borrowAmount, setBorrowAmount] = useState('0');

  const collateralAmount = useMemo(() => (useLoanTokens ? '0' : amount), [
    useLoanTokens,
    amount,
  ]);
  const loanTokenAmount = useMemo(() => (useLoanTokens ? amount : '0'), [
    useLoanTokens,
    amount,
  ]);

  useEffect(() => {
    const run = async () => {
      const _totalDeposit = await totalDeposit(
        getTokenContract(collateralToken).address,
        getTokenContract(loanToken).address,
        useLoanTokens ? '0' : amount,
        useLoanTokens ? amount : '0',
      );
      const _marginBorrow = await _getMarginBorrowAmountAndRate(
        loanToken,
        leverage,
        _totalDeposit,
      );
      return _marginBorrow.borrowAmount;
    };
    run().then(setBorrowAmount).catch(console.error);
  }, [amount, collateralToken, leverage, loanToken, useLoanTokens]);

  const {
    value: collateralTokensReceived,
  } = useSwapsExternal_getSwapExpectedReturn(
    loanToken,
    collateralToken,
    borrowAmount,
  );

  const collateralTokenAmount = useMemo(() => {
    return bignumber(collateralTokensReceived)
      .mul(10 ** 18)
      .div(borrowAmount)
      .toFixed(0);
  }, [borrowAmount, collateralTokensReceived]);

  const { minReturn } = useSlippage(collateralTokenAmount, slippage);

  const { trade, ...tx } = useApproveAndTrade(
    pair,
    position,
    collateral,
    leverage,
    amount,
    minReturn,
  );

  const submit = () => {
    trade({
      pair,
      position,
      collateralToken,
      collateral,
      leverage,
      amount,
    });
    onCloseModal();
  };

  const txArgs = [
    HashZero, //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    getTokenContract(collateralToken).address,
    account, // trader
    minReturn,
    '0x',
  ];

  const txConf = {
    value: collateral === Asset.RBTC ? amount : '0',
  };

  const simulator = useFilterSimulatorResponseLogs<TradeEventData>(
    useSimulator(
      contractName,
      'marginTrade',
      txArgs,
      collateral === Asset.RBTC ? amount : '0',
      amount !== '0' && !!contractName && !!position,
      collateral !== Asset.WRBTC && contractName && position
        ? {
            asset: collateral,
            spender: getContract(contractName).address,
            amount,
          }
        : undefined,
    ),
    TRADE_LOG_SIGNATURE_HASH,
    TradeLogInputs,
  );

  const { entryPrice, positionSize, borrowedAmount } = useMemo(() => {
    const log: TradeEventData | undefined = simulator.logs.shift()?.decoded;
    const price = log?.entryPrice || '0';
    const entryPrice =
      position === TradingPosition.LONG
        ? bignumber(1)
            .div(price)
            .mul(10 ** 36)
            .toFixed(0)
        : price;
    return {
      entryPrice,
      positionSize: log?.positionSize || '0',
      borrowedAmount: log?.borrowedAmount || '0',
    };
  }, [simulator.logs, position]);

  const liquidationPrice = usePositionLiquidationPrice(
    borrowedAmount,
    positionSize,
    position,
    MAINTENANCE_MARGIN,
  );

  const [ignoreError, setIgnoreError] = useState(false);
  const disableButtonAfterSimulatorError = useMemo(() => {
    return ignoreError ? false : simulator.status === SimulationStatus.FAILED;
  }, [ignoreError, simulator.status]);

  const { value } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    loanTokenAmount,
    collateralAmount,
    collateralToken,
  );

  const { price } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    value.principal,
    position === TradingPosition.SHORT,
  );

  const positionSizeConverted = useMemo(() => {
    if (useLoanTokens) {
      return bignumber(amount).mul(leverage).div(price).toFixed(0);
    } else {
      return bignumber(amount).mul(leverage).mul(price).toFixed(0);
    }
  }, [amount, leverage, price, useLoanTokens]);

  return (
    <>
      <Dialog
        dataAttribute="margin-select-asset-review-order-close-button"
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
          />
          <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <TxFeeCalculator
              args={txArgs}
              txConfig={txConf}
              methodName="marginTrade"
              contractName={contractName}
              condition={true}
              textClassName={'tw-text-gray-10 tw-text-gray-10 tw-pr-2'}
            />
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
                  {weiToAssetNumberFormat(
                    positionSizeConverted,
                    useLoanTokens ? collateralToken : loanToken,
                  )}{' '}
                  <AssetRenderer
                    asset={useLoanTokens ? collateralToken : loanToken}
                  />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.margin)}
              value={
                <>
                  {weiToNumberFormat(amount, 4)}{' '}
                  <AssetRenderer asset={collateral} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.leverage)}
              value={toNumberFormat(leverage) + 'x'}
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.entryPrice)}
              value={
                <>
                  {useTenderlySimulator ? (
                    <>
                      <LoadableValue
                        loading={simulator.status === SimulationStatus.PENDING}
                        value={weiToNumberFormat(entryPrice, 6)}
                        tooltip={weiToNumberFormat(entryPrice, 18)}
                      />{' '}
                      <AssetRenderer asset={pair.longAsset} />
                    </>
                  ) : (
                    <>
                      <PricePrediction
                        position={position}
                        leverage={leverage}
                        loanToken={loanToken}
                        collateralToken={collateralToken}
                        useLoanTokens={useLoanTokens}
                        weiAmount={amount}
                      />{' '}
                      <AssetRenderer asset={pair.longAsset} />
                    </>
                  )}
                </>
              }
            />
            {useTenderlySimulator && (
              <LabelValuePair
                label={t(
                  translations.marginTradePage.tradeDialog.liquidationPrice,
                )}
                value={
                  <>
                    <LoadableValue
                      loading={simulator.status === SimulationStatus.PENDING}
                      value={
                        <>
                          {toNumberFormat(liquidationPrice, 4)}{' '}
                          {pair.longDetails.symbol}
                        </>
                      }
                    />
                  </>
                }
              />
            )}
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

            {useTenderlySimulator &&
              simulator.status === SimulationStatus.FAILED && (
                <>
                  <ErrorBadge
                    content={t(
                      translations.marginTradePage.tradeDialog
                        .estimationErrorNote,
                      { error: simulator.error },
                    )}
                  />
                  <Checkbox
                    checked={ignoreError}
                    onChange={() => setIgnoreError(!ignoreError)}
                    label={t(translations.common.continueToFailure)}
                    data-action-id="accept-terms-checkbox"
                  />
                </>
              )}
          </div>

          <div className="tw-mw-340 tw-mx-auto">
            <DialogButton
              confirmLabel={t(translations.common.confirm)}
              onConfirm={submit}
              disabled={openTradesLocked || disableButtonAfterSimulatorError}
              cancelLabel={t(translations.common.cancel)}
              onCancel={() => dispatch(actions.closeTradingModal(position))}
              data-action-id="margin-reviewTransaction-button-confirm"
            />
          </div>
        </div>
      </Dialog>
      <TransactionDialog
        tx={tx}
        onUserConfirmed={() => dispatch(actions.closeTradingModal(position))}
        fee={
          <TxFeeCalculator
            args={txArgs}
            txConfig={txConf}
            methodName="marginTrade"
            contractName={contractName}
            condition={true}
            textClassName={'tw-text-gray-10 tw-text-gray-10'}
          />
        }
        finalMessage={
          <TradeDialogInfo
            position={position}
            leverage={leverage}
            orderTypeValue={orderType}
            amount={amount}
            collateral={collateral}
            loanToken={loanToken}
            collateralToken={collateralToken}
            useLoanTokens={useLoanTokens}
          />
        }
        onError={() => {
          Toast(
            'error',
            <div className="tw-flex">
              <p className="tw-mb-0 tw-mr-2">
                <Trans
                  i18nKey={translations.transactionDialog.pendingUser.failed}
                />
              </p>
              <TradeToastInfo
                position={position}
                leverage={leverage}
                orderTypeValue={orderType}
                amount={amount}
                collateral={collateral}
                loanToken={loanToken}
                collateralToken={collateralToken}
                useLoanTokens={useLoanTokens}
              />
            </div>,
          );
        }}
        onSuccess={() => {
          Toast(
            'success',
            <div className="tw-flex">
              <p className="tw-mb-0 tw-mr-2">
                <Trans
                  i18nKey={translations.transactionDialog.txStatus.complete}
                />
              </p>
              <TradeToastInfo
                position={position}
                leverage={leverage}
                orderTypeValue={orderType}
                amount={amount}
                collateral={collateral}
                loanToken={loanToken}
                collateralToken={collateralToken}
                useLoanTokens={useLoanTokens}
              />
            </div>,
          );
        }}
      />
    </>
  );
};

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  label,
  value,
  className,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center',
      className,
    )}
  >
    <div className="tw-w-1/2 tw-text-gray-10 tw-text-gray-10">{label}</div>
    <div className="sm:tw-w-1/3 tw-w-1/2 tw-font-medium">{value}</div>
  </div>
);
