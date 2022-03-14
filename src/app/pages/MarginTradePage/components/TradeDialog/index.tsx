import cn from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toWei } from 'web3-utils';
import { Checkbox } from '@blueprintjs/core';

import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { Slider } from 'app/components/Form/Slider';
import { useMaintenance } from 'app/hooks/useMaintenance';
import {
  discordInvite,
  MAINTENANCE_MARGIN,
  TRADE_LOG_SIGNATURE_HASH,
  useTenderlySimulator,
} from 'utils/classifiers';

import { translations } from '../../../../../locales/i18n';
import { Asset } from '../../../../../types';
import {
  getContract,
  getLendingContractName,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { fromWei } from '../../../../../utils/blockchain/math-helpers';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { LoadableValue } from '../../../../components/LoadableValue';
import { Dialog } from '../../../../containers/Dialog';
import { useApproveAndTrade } from '../../../../hooks/trading/useApproveAndTrade';
import { useTrading_resolvePairTokens } from '../../../../hooks/trading/useTrading_resolvePairTokens';
import { useAccount } from '../../../../hooks/useAccount';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { TradingPosition } from 'types/trading-position';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { PricePrediction } from '../../../../containers/MarginTradeForm/PricePrediction';
import { useSimulator } from '../../../../hooks/simulator/useSimulator';
import {
  SimulationStatus,
  useFilterSimulatorResponseLogs,
} from '../../../../hooks/simulator/useFilterSimulatorResponseLogs';
import { DummyInput } from '../../../../components/Form/Input';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { bignumber } from 'mathjs';
import { TradeEventData } from '../../../../../types/active-loan';
import { usePositionLiquidationPrice } from '../../../../hooks/trading/usePositionLiquidationPrice';
import { useSwapsExternal_getSwapExpectedReturn } from 'app/hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import {
  totalDeposit,
  _getMarginBorrowAmountAndRate,
} from './trading-dialog.helpers';

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

export function TradeDialog() {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const [slippage, setSlippage] = useState(0.5);
  const dispatch = useDispatch();

  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);
  const asset = useMemo(() => AssetsDictionary.get(collateral), [collateral]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const [borrowAmount, setBorrowAmount] = useState('0');

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

  const submit = () =>
    trade({
      pair,
      position,
      collateralToken,
      collateral,
      leverage,
      amount,
    });

  const txArgs = [
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
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

  const [ignoreError, setIngoreError] = useState(false);
  const disableButtonAfterSimulatorError = useMemo(() => {
    return ignoreError ? false : simulator.status === SimulationStatus.FAILED;
  }, [ignoreError, simulator.status]);

  return (
    <>
      <Dialog
        isOpen={!!position}
        onClose={() => dispatch(actions.closeTradingModal())}
      >
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.marginTradePage.tradeDialog.title)}
          </h1>
          <div className="tw-text-sm tw-font-light tw-tracking-normal">
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.pair)}
              value={pair.name}
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.leverage)}
              value={<>{toNumberFormat(leverage)}x</>}
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.direction)}
              value={
                position === TradingPosition.LONG
                  ? t(translations.marginTradePage.tradeDialog.position.long)
                  : t(translations.marginTradePage.tradeDialog.position.short)
              }
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.asset)}
              value={
                <>
                  <LoadableValue
                    loading={false}
                    value={weiToNumberFormat(amount, 4)}
                    tooltip={fromWei(amount)}
                  />{' '}
                  {asset.symbol}
                </>
              }
            />
            <LabelValuePair
              label={t(
                translations.marginTradePage.tradeDialog.maintananceMargin,
              )}
              value={<>{weiToNumberFormat(MAINTENANCE_MARGIN)}%</>}
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

          <FormGroup
            className="tw-mt-8"
            label={t(translations.buySovPage.slippageDialog.tolerance)}
          >
            <Slider
              value={slippage}
              onChange={setSlippage}
              min={0.1}
              max={1}
              stepSize={0.05}
              labelRenderer={value => <>{value}%</>}
              labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.marginTradePage.tradeDialog.entryPrice)}
            className="tw-mt-8"
          >
            {useTenderlySimulator ? (
              <DummyInput
                value={
                  <LoadableValue
                    loading={simulator.status === SimulationStatus.PENDING}
                    value={weiToNumberFormat(entryPrice, 6)}
                    tooltip={weiToNumberFormat(entryPrice, 18)}
                  />
                }
                appendElem={<AssetSymbolRenderer asset={pair.longAsset} />}
              />
            ) : (
              <div className="tw-input-wrapper readonly">
                <div className="tw-input">
                  <PricePrediction
                    position={position}
                    leverage={leverage}
                    loanToken={loanToken}
                    collateralToken={collateralToken}
                    useLoanTokens={useLoanTokens}
                    weiAmount={amount}
                  />
                </div>
                <div className="tw-input-append">{pair.longDetails.symbol}</div>
              </div>
            )}
          </FormGroup>
          <TxFeeCalculator
            args={txArgs}
            txConfig={txConf}
            methodName="marginTrade"
            contractName={contractName}
            condition={true}
          />
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
                    onChange={() => setIngoreError(!ignoreError)}
                    label={t(translations.common.continueToFailure)}
                  />
                </>
              )}
          </div>

          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => submit()}
            disabled={openTradesLocked || disableButtonAfterSimulatorError}
            cancelLabel={t(translations.common.cancel)}
            onCancel={() => dispatch(actions.closeTradingModal())}
          />
        </div>
      </Dialog>
      <TxDialog
        tx={tx}
        onUserConfirmed={() => dispatch(actions.closeTradingModal())}
      />
    </>
  );
}

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-justify-between tw-space-x-4 tw-mb-2',
        props.className,
      )}
    >
      <div className="tw-truncate tw-w-7/12">{props.label}</div>
      <div className="tw-truncate tw-w-5/12 tw-text-left">{props.value}</div>
    </div>
  );
}
