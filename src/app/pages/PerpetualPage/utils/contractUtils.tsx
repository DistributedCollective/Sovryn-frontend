import React from 'react';
import { walletService, WalletProvider } from '@sovryn/react-wallet';
import { BigNumber, Signer } from 'ethers';
import { Asset, Chain } from 'types';
import { Sovryn } from 'utils/sovryn';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { ContractName } from 'utils/types/contracts';
import { actions as txActions } from 'store/global/transactions-store/slice';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import {
  bridgeNetwork,
  MultiCallData,
} from '../../BridgeDepositPage/utils/bridge-network';
import { getContract } from 'utils/blockchain/contract-helpers';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { TradingPosition } from 'types/trading-position';
import {
  getRequiredMarginCollateralWithGasFees,
  createOrderDigest,
} from './perpUtils';
import {
  perpUtils,
  TraderState,
  AMMState,
  PerpParameters,
  LiqPoolState,
} from '@sovryn/perpetual-swap';
import {
  fromWei,
  numberFromWei,
} from '../../../../utils/blockchain/math-helpers';
import {
  CheckAndApproveResultWithError,
  PERPETUAL_SLIPPAGE_DEFAULT,
  PERPETUAL_CHAIN_ID,
  PERPETUAL_PAYMASTER,
  PERPETUAL_CHAIN,
} from '../types';
import { BridgeNetworkDictionary } from '../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Trans } from 'react-i18next';
import { translations } from '../../../../locales/i18n';
import { numberToPercent } from '../../../../utils/display-text/format';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import {
  PerpetualTxMethod,
  PerpetualTx,
  PerpetualTxTrade,
  PerpetualTxLimitOrder,
  PerpetualTxDepositMargin,
  PerpetualTxWithdrawMargin,
} from '../components/TradeDialog/types';
import { PerpetualQueriesContextValue } from '../contexts/PerpetualQueriesContext';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { SendTxResponseInterface } from '../../../hooks/useSendContractTx';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import {
  createSignature,
  getRequiredMarginCollateral,
  getEstimatedMarginCollateralForLimitOrder,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { gsnNetwork } from '../../../../utils/gsn/GsnNetwork';
import { SovrynNetwork } from '../../../../utils/sovryn/sovryn-network';
import { PerpetualPairDictionary } from '../../../../utils/dictionaries/perpetual-pair-dictionary';

const {
  calculateSlippagePriceFromMidPrice,
  calculateSlippagePrice,
  getPrice,
  getMidPrice,
  isTraderInitialMarginSafe,
} = perpUtils;

export const ONE_64x64 = BigNumber.from('0x10000000000000000');
export const DEC_18 = BigNumber.from(10).pow(BigNumber.from(18));

export const getTradeDirection = (tradingPosition: TradingPosition) =>
  tradingPosition === TradingPosition.LONG ? 1 : -1;

export const getSignedAmount = (
  position: TradingPosition,
  weiAmount: string,
) => {
  return getTradeDirection(position) * Number(fromWei(weiAmount));
};

// Converts wei string to ABK64x64 bigint-format, creates string from number with 18 decimals
export const weiToABK64x64 = (value: string) =>
  BigNumber.from(value).mul(ONE_64x64).div(DEC_18);

// Converts float to ABK64x64 bigint-format, creates string from number with 18 decimals
export const floatToABK64x64 = (value: number) => {
  if (value === 0) {
    return BigNumber.from(0);
  }

  const sign = Math.sign(value);
  const absoluteValue = Math.abs(value);

  const stringValueArray = absoluteValue.toFixed(18).split('.');
  const integerPart = BigNumber.from(stringValueArray[0]);
  const decimalPart = BigNumber.from(stringValueArray[1]);

  const integerPartBigNumber = integerPart.mul(ONE_64x64);
  const decimalPartBigNumber = decimalPart.mul(ONE_64x64).div(DEC_18);

  return integerPartBigNumber.add(decimalPartBigNumber).mul(sign);
};

export const ABK64x64ToWei = (value: BigNumber) => {
  const sign = value.lt(0) ? -1 : 1;
  value = value.mul(sign);
  const integerPart = value.div(ONE_64x64);
  let decimalPart = value.sub(integerPart.mul(ONE_64x64));
  decimalPart = decimalPart.mul(DEC_18).div(ONE_64x64);
  const k = 18 - decimalPart.toString().length;

  const sPad = '0'.repeat(k);
  const weiString = integerPart.toString() + sPad + decimalPart.toString();

  return weiString;
};

export const ABK64x64ToFloat = (value: BigNumber) => {
  const sign = value.lt(0) ? -1 : 1;
  value = value.mul(sign);
  const integerPart = value.div(ONE_64x64);
  let decimalPart = value.sub(integerPart.mul(ONE_64x64));
  decimalPart = decimalPart.mul(DEC_18).div(ONE_64x64);
  const k = 18 - decimalPart.toString().length;

  const sPad = '0'.repeat(k);
  const numberString =
    integerPart.toString() + '.' + sPad + decimalPart.toString();

  return parseFloat(numberString) * sign;
};

export const checkAndApprove = async (
  contractName: ContractName,
  spenderAddress: string,
  amount: string,
  asset: Asset,
  customData?: any,
): Promise<CheckAndApproveResultWithError> => {
  const sovryn = Sovryn;
  const address = walletService.address.toLowerCase();
  const dispatch = sovryn.store().dispatch;
  dispatch(txActions.setLoading(true));
  let nonce = await bridgeNetwork.nonce(Chain.BSC);
  const approveGasPrice = await bridgeNetwork.getNode(Chain.BSC).getGasPrice();

  try {
    const allowance = await bridgeNetwork.call(
      Chain.BSC,
      getContract('PERPETUALS_token').address,
      marginTokenAbi,
      'allowance',
      [address, getContract('perpetualManager').address],
    );

    let approveTx: any = null;
    if (BigNumber.from(allowance).lt(amount)) {
      approveTx = await contractWriter
        .send(contractName, 'approve', [spenderAddress, amount], {
          nonce,
          from: address,
          gas: 60000,
          gasPrice: approveGasPrice,
        })
        .then(tx => {
          dispatch(
            txActions.addTransaction({
              chainId: BridgeNetworkDictionary.get(Chain.BSC)?.chainId,
              transactionHash: tx as string,
              approveTransactionHash: null,
              type: TxType.APPROVE,
              status: TxStatus.PENDING,
              loading: false,
              to: contractName,
              from: address,
              value: '0',
              asset,
              assetAmount: amount,
              customData,
            }),
          );

          return tx;
        });
      nonce += 1;
    }
    return {
      approveTx,
      nonce,
      rejected: false,
    };
  } catch (e) {
    return {
      approveTx: null,
      nonce,
      rejected: true,
      error: e,
    };
  }
};

export type Validation = {
  valid: boolean;
  isWarning: boolean;
  errors: Error[];
  errorMessages: React.ReactNode[];
};

export const validatePositionChange = (
  amountChange: number,
  marginChange: number,
  targetLeverage: number,
  slippage: number,
  availableBalance: number,
  traderState: TraderState,
  perpParameters: PerpParameters,
  ammState: AMMState,
  useMetaTransactions: boolean,
) => {
  const result: Validation = {
    valid: true,
    isWarning: false,
    errors: [],
    errorMessages: [],
  };

  if (ammState.indexS2PriceData === 0 || perpParameters.fLotSizeBC === 0) {
    return undefined;
  }

  if (amountChange !== 0) {
    const slippagePrice = calculateSlippagePriceFromMidPrice(
      perpParameters,
      ammState,
      slippage,
      Math.sign(amountChange),
    );
    const expectedPrice = getPrice(amountChange, perpParameters, ammState);

    if (
      amountChange > 0
        ? expectedPrice > slippagePrice
        : expectedPrice < slippagePrice
    ) {
      const midPrice = getMidPrice(perpParameters, ammState);
      const requiredSlippage = Math.abs(expectedPrice - midPrice) / midPrice;

      result.valid = false;
      result.isWarning = true;
      result.errors.push(new Error('Expected price exceeds limit price!'));
      result.errorMessages?.push(
        <Trans
          parent="div"
          key="priceExceedsSlippage"
          i18nKey={translations.perpetualPage.warnings.priceExceedsSlippage}
          values={{ slippage: numberToPercent(requiredSlippage, 2) }}
        />,
      );
    }
  }

  if (
    !isTraderInitialMarginSafe(
      traderState,
      marginChange,
      amountChange,
      perpParameters,
      ammState,
    )
  ) {
    result.valid = false;
    result.isWarning = true;
    result.errors.push(new Error('Resulting margin is not safe!'));
    result.errorMessages?.push(
      <Trans
        parent="div"
        key="targetMarginUnsafe"
        i18nKey={translations.perpetualPage.warnings.targetMarginUnsafe}
      />,
    );
  }

  if (amountChange !== 0 || marginChange !== 0) {
    const targetAmount = amountChange + traderState.marginAccountPositionBC;

    const requiredMargin = getRequiredMarginCollateralWithGasFees(
      targetLeverage,
      targetAmount,
      perpParameters,
      ammState,
      traderState,
      slippage,
      useMetaTransactions,
    );

    if (requiredMargin > traderState.availableCashCC + availableBalance) {
      result.valid = false;
      result.isWarning = true;
      result.errors.push(new Error('Order cost exceeds total balance!'));
      result.errorMessages?.push(
        <Trans
          parent="div"
          key="targetMarginUnsafe"
          i18nKey={translations.perpetualPage.warnings.exceedsBalance}
        />,
      );
    }
  }

  return result;
};

export const initialAmmState: AMMState = {
  L1: 0,
  K2: 0,
  M1: 0,
  M2: 0,
  M3: 0,
  fCurrentTraderExposureEMA: 0,
  indexS2PriceData: 0,
  indexS3PriceData: 0,
  indexS2PriceDataOracle: 0,
  indexS3PriceDataOracle: 0,
  currentMarkPremiumRate: 0,
  currentPremiumRate: 0,
  defFundToTargetRatio: 0,
};

const parseAmmState = (response: any): AMMState =>
  response?.[0]
    ? {
        L1: ABK64x64ToFloat(response[0][0]),
        K2: ABK64x64ToFloat(response[0][1]),
        M1: ABK64x64ToFloat(response[0][2]),
        M2: ABK64x64ToFloat(response[0][3]),
        M3: ABK64x64ToFloat(response[0][4]),
        fCurrentTraderExposureEMA: ABK64x64ToFloat(response[0][5]),
        indexS2PriceData: ABK64x64ToFloat(response[0][6]),
        indexS3PriceData: ABK64x64ToFloat(response[0][7]),
        currentMarkPremiumRate: ABK64x64ToFloat(response[0][8]),
        currentPremiumRate: ABK64x64ToFloat(response[0][9]),
        indexS2PriceDataOracle: ABK64x64ToFloat(response[0][10]),
        indexS3PriceDataOracle: ABK64x64ToFloat(response[0][11]),
        defFundToTargetRatio:
          response[0][12] && ABK64x64ToFloat(response[0][12]),
      }
    : initialAmmState;

export const ammStateCallData = (perpetualId: string): MultiCallData => ({
  abi: perpetualManagerAbi,
  address: getContract('perpetualManager').address,
  fnName: 'getAMMState',
  key: 'ammState',
  args: [perpetualId],
  parser: parseAmmState,
});

export const initialTraderState: TraderState = {
  marginBalanceCC: 0,
  availableMarginCC: 0,
  availableCashCC: 0,
  marginAccountCashCC: 0,
  marginAccountPositionBC: 0,
  marginAccountLockedInValueQC: 0,
  fUnitAccumulatedFundingStart: 0,
};

const parseTraderState = (response: any): TraderState =>
  response?.[0]
    ? {
        marginBalanceCC: ABK64x64ToFloat(response[0][0]),
        availableMarginCC: ABK64x64ToFloat(response[0][1]),
        availableCashCC: ABK64x64ToFloat(response[0][2]),
        marginAccountCashCC: ABK64x64ToFloat(response[0][3]),
        marginAccountPositionBC: ABK64x64ToFloat(response[0][4]),
        marginAccountLockedInValueQC: ABK64x64ToFloat(response[0][5]),
        fUnitAccumulatedFundingStart: ABK64x64ToFloat(response[0][6]),
      }
    : initialTraderState;

export const traderStateCallData = (
  perpetualId: string,
  walletAddress: string,
): MultiCallData => ({
  abi: perpetualManagerAbi,
  address: getContract('perpetualManager').address,
  fnName: 'getTraderState',
  key: 'traderState',
  args: [perpetualId, walletAddress],
  parser: parseTraderState,
});

export const initialLiquidityPoolState: LiqPoolState = {
  fPnLparticipantsCashCC: 0,
  fAMMFundCashCC: 0,
  fDefaultFundCashCC: 0,
  iPriceUpdateTimeSec: 0,
  fTargetAMMFundSize: 0,
  fTargetDFSize: 0,
  iLastTargetPoolSizeTime: 0,
  iLastFundingTime: 0,
  isRunning: false,
};

const parseLiquidityPoolState = (response: any): LiqPoolState =>
  response?.[0]
    ? {
        fPnLparticipantsCashCC: ABK64x64ToFloat(response[0][6]),
        fAMMFundCashCC: ABK64x64ToFloat(response[0][7]),
        fDefaultFundCashCC: ABK64x64ToFloat(response[0][8]),
        iPriceUpdateTimeSec: ABK64x64ToFloat(response[0][9]),
        fTargetAMMFundSize: ABK64x64ToFloat(response[0][10]),
        fTargetDFSize: ABK64x64ToFloat(response[0][11]),
        iLastTargetPoolSizeTime: ABK64x64ToFloat(response[0][12]),
        iLastFundingTime: ABK64x64ToFloat(response[0][13]),
        isRunning: response[0][1],
      }
    : initialLiquidityPoolState;

export const liquidityPoolStateCallData = (poolId: string): MultiCallData => ({
  abi: perpetualManagerAbi,
  address: getContract('perpetualManager').address,
  fnName: 'getLiquidityPool',
  key: 'liquidityPoolState',
  args: [poolId],
  parser: parseLiquidityPoolState,
});

export const initialPerpetualParameters: PerpParameters = {
  poolId: 0,
  oracleS2Addr: '',
  oracleS3Addr: '',

  fInitialMarginRateAlpha: 0,
  fMarginRateBeta: 0,
  fInitialMarginRateCap: 0,
  fOpenInterest: 0,
  fMaintenanceMarginRateAlpha: 0,
  fTreasuryFeeRate: 0,
  fPnLPartRate: 0,
  fReferralRebateCC: 0,
  fLiquidationPenaltyRate: 0,
  fMinimalSpread: 0,
  fMinimalSpreadInStress: 0,
  fLotSizeBC: 0,
  fFundingRateClamp: 0,
  fMarkPriceEMALambda: 0,
  fSigma2: 0,
  fSigma3: 0,
  fRho23: 0,
  // default fund / AMM fund
  fStressReturnS2_0: 0,
  fStressReturnS2_1: 0,
  fStressReturnS3_0: 0,
  fStressReturnS3_1: 0,
  fDFCoverNRate: 0,
  fDFLambda_0: 0,
  fDFLambda_1: 0,
  fAMMTargetDD_0: 0,
  fAMMTargetDD_1: 0,
  fAMMMinSizeCC: 0,
  fMinimalTraderExposureEMA: 0,
  fMaximalTradeSizeBumpUp: 0,
  // funding state
  fCurrentFundingRate: 0,
  fUnitAccumulatedFunding: 0,
  fMaxPositionBC: 0,
};

const parsePerpetualParameters = (response: any): PerpParameters =>
  response?.[0]
    ? {
        poolId: BigNumber.from(response[0][1]).toNumber(),
        oracleS2Addr: response[0][2],
        oracleS3Addr: response[0][3],
        fCurrentFundingRate: ABK64x64ToFloat(response[0][10]),
        fUnitAccumulatedFunding: ABK64x64ToFloat(response[0][11]),
        fOpenInterest: ABK64x64ToFloat(response[0][13]),
        fInitialMarginRateAlpha: ABK64x64ToFloat(response[0][17]),
        fMarginRateBeta: ABK64x64ToFloat(response[0][18]),
        fInitialMarginRateCap: ABK64x64ToFloat(response[0][19]),
        fMaintenanceMarginRateAlpha: ABK64x64ToFloat(response[0][20]),
        fTreasuryFeeRate: ABK64x64ToFloat(response[0][21]),
        fPnLPartRate: ABK64x64ToFloat(response[0][22]),
        fReferralRebateCC: ABK64x64ToFloat(response[0][23]),
        fLiquidationPenaltyRate: ABK64x64ToFloat(response[0][24]),
        fMinimalSpread: ABK64x64ToFloat(response[0][25]),
        fMinimalSpreadInStress: ABK64x64ToFloat(response[0][26]),
        fLotSizeBC: ABK64x64ToFloat(response[0][27]),
        fFundingRateClamp: ABK64x64ToFloat(response[0][28]),
        fMarkPriceEMALambda: ABK64x64ToFloat(response[0][29]),
        fSigma2: ABK64x64ToFloat(response[0][30]),
        fSigma3: ABK64x64ToFloat(response[0][31]),
        fRho23: ABK64x64ToFloat(response[0][32]),
        fStressReturnS2_0: ABK64x64ToFloat(response[0][34][0]),
        fStressReturnS2_1: ABK64x64ToFloat(response[0][34][1]),
        fStressReturnS3_0: ABK64x64ToFloat(response[0][35][0]),
        fStressReturnS3_1: ABK64x64ToFloat(response[0][35][1]),
        fDFCoverNRate: ABK64x64ToFloat(response[0][36]),
        fDFLambda_0: ABK64x64ToFloat(response[0][37][0]),
        fDFLambda_1: ABK64x64ToFloat(response[0][37][1]),
        fAMMTargetDD_0: ABK64x64ToFloat(response[0][38][0]),
        fAMMTargetDD_1: ABK64x64ToFloat(response[0][38][1]),
        fAMMMinSizeCC: ABK64x64ToFloat(response[0][39]),
        fMinimalTraderExposureEMA: ABK64x64ToFloat(response[0][40]),
        fMaximalTradeSizeBumpUp: ABK64x64ToFloat(response[0][42]),
        fMaxPositionBC: ABK64x64ToFloat(response[0][49]),
      }
    : initialPerpetualParameters;

export const perpetualParametersCallData = (
  perpetualId: string,
): MultiCallData => ({
  abi: perpetualManagerAbi,
  address: getContract('perpetualManager').address,
  fnName: 'getPerpetual',
  key: 'perpetualParameters',
  args: [perpetualId],
  parser: parsePerpetualParameters,
});

export const balanceCallData = (
  contractName: ContractName,
  walletAddress: string,
  key: string,
): MultiCallData => {
  const contract = getContract(contractName);
  return {
    abi: contract.abi,
    address: contract.address,
    fnName: 'balanceOf',
    key,
    args: [walletAddress],
    parser: value => (value?.[0] ? String(value[0]) : '0'),
  };
};

const MASK_CLOSE_ONLY = 0x80000000;
const MASK_MARKET_ORDER = 0x40000000;
const MASK_STOP_LOSS_ORDER = 0x20000000;
const MASK_TAKE_PROFIT_ORDER = 0x10000000;
const MASK_USE_TARGET_LEVERAGE = 0x08000000;

const perpetualTradeArgs = (
  context: PerpetualQueriesContextValue,
  account: string,
  transaction: PerpetualTxTrade,
): Parameters<SendTxResponseInterface['send']>[0] => {
  const {
    isClosePosition = false,
    /** amount as wei string */
    amount = '0',
    leverage = 1,
    slippage = PERPETUAL_SLIPPAGE_DEFAULT,
    tradingPosition = TradingPosition.LONG,
    pair: pairType,
  } = transaction;
  const pair = PerpetualPairDictionary.get(pairType);
  const signedAmount = getSignedAmount(tradingPosition, amount);
  const tradeDirection = Math.sign(signedAmount);

  const { averagePrice } = context.perpetuals[pairType];

  const limitPrice = calculateSlippagePrice(
    averagePrice,
    slippage,
    tradeDirection,
  );

  const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
  const timeNow = Math.round(Date.now() / 1000);
  const order = [
    pair.id,
    account,
    floatToABK64x64(signedAmount),
    floatToABK64x64(limitPrice),
    0, // TODO: this is fTriggerPrice, it will need to be adjusted once we have limit orders functionality, it's 0 for market orders
    deadline,
    ethGenesisAddress,
    isClosePosition ? MASK_CLOSE_ONLY : MASK_MARKET_ORDER,
    floatToABK64x64(leverage),
    timeNow,
  ];

  return [order];
};

const perpetualLimitTradeArgs = async (
  context: PerpetualQueriesContextValue,
  account: string,
  transaction: PerpetualTxLimitOrder,
): Promise<Parameters<SendTxResponseInterface['send']>[0]> => {
  const {
    isNewOrder,
    tradingPosition = TradingPosition.LONG,
    amount,
    limit,
    trigger,
    expiry,
    leverage = 1,
    pair: pairType,
  } = transaction;
  const pair = PerpetualPairDictionary.get(pairType);

  const signedAmount = getSignedAmount(tradingPosition, amount);

  const order = {
    iPerpetualId: pair.id,
    traderAddr: account,
    fAmount: signedAmount,
    fLimitPrice: numberFromWei(limit),
    fTriggerPrice: numberFromWei(trigger),
    iDeadline: expiry,
    referrerAddr: ethGenesisAddress,
    flags: 0,
    fLeverage: leverage,
    createdTimestamp: Date.now(),
  };

  const allowance = getEstimatedMarginCollateralForLimitOrder(
    context.perpetuals[pair.pairType].perpetualParameters,
    context.perpetuals[pair.pairType].ammState,
    order.fLeverage,
    order.fAmount,
    order.fLimitPrice,
    order.fTriggerPrice,
  );

  const digest = await createOrderDigest(
    order,
    isNewOrder || false,
    getContract('perpetualManager').address,
    PERPETUAL_CHAIN_ID,
  );
  const signature = walletService.signMessage(digest);
  return [order, signature, allowance];
};

export const perpetualTransactionArgs = async (
  perpetuals: PerpetualQueriesContextValue,
  pair: PerpetualPair,
  account: string,
  transaction: PerpetualTx,
): Promise<Parameters<SendTxResponseInterface['send']>[0]> => {
  switch (transaction.method) {
    case PerpetualTxMethod.trade:
      const tradeTx: PerpetualTxTrade = transaction;
      return perpetualTradeArgs(perpetuals, account, tradeTx);
    case PerpetualTxMethod.limitOrder:
      const limitTx: PerpetualTxLimitOrder = transaction;
      return await perpetualLimitTradeArgs(perpetuals, account, limitTx);
    case PerpetualTxMethod.deposit:
      const depositTx: PerpetualTxDepositMargin = transaction;
      return [pair.id, weiToABK64x64(depositTx.amount)];
    case PerpetualTxMethod.withdraw:
      const withdrawTx: PerpetualTxWithdrawMargin = transaction;
      return [pair.id, weiToABK64x64(withdrawTx.amount)];
    case PerpetualTxMethod.withdrawAll:
      return [pair.id];
  }
};
