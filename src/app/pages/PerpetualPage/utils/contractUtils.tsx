import React from 'react';
import { walletService } from '@sovryn/react-wallet';
import { BigNumber } from 'ethers';
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
  MASK_CLOSE_ONLY,
  MASK_MARKET_ORDER,
  MASK_LIMIT_ORDER,
  MASK_KEEP_POS_LEVERAGE,
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
  PERPETUAL_CHAIN,
  PerpetualTradeAnalysis,
  PerpetualTradeType,
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
  PerpetualTxCreateLimitOrder,
  PerpetualTxCancelLimitOrder,
  PerpetualTxDepositMargin,
  PerpetualTxWithdrawMargin,
} from '../types';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { SendTxResponseInterface } from '../../../hooks/useSendContractTx';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { PerpetualPairDictionary } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import {
  getLiquidityPoolFieldToIndexMap,
  getPerpStorageFieldToIndexMap,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';

const {
  calculateSlippagePrice,
  createOrderDigest,
  getPrice,
  getMidPrice,
  isTraderInitialMarginSafe,
} = perpUtils;

export const traderMgnTokenAddr = '0x0'; // TODO: This is only temporary, delete it once we have full support for BTCB as collateral

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
  analysis: Pick<
    PerpetualTradeAnalysis,
    'amountChange' | 'marginChange' | 'limitPrice' | 'orderCost'
  >,
  availableBalance: number,
  traderState: TraderState,
  perpParameters: PerpParameters,
  ammState: AMMState,
  tradeType: PerpetualTradeType | undefined = PerpetualTradeType.MARKET,
  limitOrdersCount: number | undefined = 0,
) => {
  const result: Validation = {
    valid: true,
    isWarning: false,
    errors: [],
    errorMessages: [],
  };

  const isLimitOrder = [
    PerpetualTradeType.LIMIT,
    PerpetualTradeType.STOP,
  ].includes(tradeType);

  if (ammState.indexS2PriceData === 0 || perpParameters.fLotSizeBC === 0) {
    return undefined;
  }

  if (analysis.amountChange !== 0) {
    const expectedPrice = getPrice(
      analysis.amountChange,
      perpParameters,
      ammState,
    );

    if (
      (analysis.amountChange > 0
        ? expectedPrice > analysis.limitPrice
        : expectedPrice < analysis.limitPrice) &&
      !isLimitOrder
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

    if (
      tradeType === PerpetualTradeType.LIMIT &&
      (analysis.amountChange > 0
        ? expectedPrice < analysis.limitPrice
        : expectedPrice > analysis.limitPrice)
    ) {
      result.valid = false;
      result.isWarning = true;
      result.errors.push(
        new Error('Expected price worse than the current market price!'),
      );
      result.errorMessages?.push(
        <Trans
          parent="div"
          key="limitPriceWorseThanCurrentPrice"
          i18nKey={
            translations.perpetualPage.warnings.limitPriceWorseThanCurrentPrice
          }
        />,
      );
    }
  }

  const isClosingTrade =
    Math.abs(traderState.marginAccountPositionBC + analysis.amountChange) <
    perpParameters.fLotSizeBC;

  if (
    !isClosingTrade &&
    !isTraderInitialMarginSafe(
      traderState,
      analysis.marginChange,
      analysis.amountChange,
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

  if (analysis.amountChange !== 0 || analysis.marginChange !== 0) {
    if (analysis.orderCost > availableBalance) {
      result.valid = false;
      result.isWarning = true;
      result.errors.push(new Error('Order cost exceeds total balance!'));
      result.errorMessages?.push(
        <Trans
          parent="div"
          key="exceedsBalance"
          i18nKey={
            translations.perpetualPage.warnings[
              isLimitOrder ? 'exceedsBalanceLimitOrder' : 'exceedsBalance'
            ]
          }
        />,
      );
    }
  }

  if (isLimitOrder && limitOrdersCount === 15) {
    result.valid = false;
    result.isWarning = false;
    result.errors.push(
      new Error('There is a maximal amount of 15 Limit/Stop orders.'),
    );
    result.errorMessages?.push(
      <Trans
        parent="div"
        key="maximalAmountOfLimitOrders"
        i18nKey={translations.perpetualPage.warnings.maximalAmountOfLimitOrders}
      />,
    );
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
        indexS2PriceDataOracle: ABK64x64ToFloat(response[0][9]),
        indexS3PriceDataOracle: ABK64x64ToFloat(response[0][10]),
        currentMarkPremiumRate: ABK64x64ToFloat(response[0][8]),
        defFundToTargetRatio:
          response[0][11] && ABK64x64ToFloat(response[0][11]),
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
  fTargetAMMFundSize: 0,
  fTargetDFSize: 0,
  isRunning: false,
};

const parseLiquidityPoolState = (response: any): LiqPoolState => {
  const fieldsToIndicesMap = getLiquidityPoolFieldToIndexMap();

  return response?.[0]
    ? {
        fPnLparticipantsCashCC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fPnLparticipantsCashCC']],
        ),
        fAMMFundCashCC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fAMMFundCashCC']],
        ),
        fDefaultFundCashCC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fDefaultFundCashCC']],
        ),
        fTargetAMMFundSize: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fTargetAMMFundSize']],
        ),
        fTargetDFSize: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fTargetDFSize']],
        ),
        isRunning: response[0][fieldsToIndicesMap['isRunning']],
      }
    : initialLiquidityPoolState;
};

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
  fOpenInterest: 0,
  fInitialMarginRate: 0,
  fMaintenanceMarginRate: 0,
  fIncentiveSpread: 0,
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

const parsePerpetualParameters = (response: any): PerpParameters => {
  const fieldsToIndicesMap = getPerpStorageFieldToIndexMap();

  return response?.[0]
    ? {
        poolId: BigNumber.from(
          response[0][fieldsToIndicesMap['poolId']],
        ).toNumber(),
        oracleS2Addr: response[0][fieldsToIndicesMap['oracleS2Addr']],
        oracleS3Addr: response[0][fieldsToIndicesMap['oracleS3Addr']],
        fCurrentFundingRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fCurrentFundingRate']],
        ),
        fUnitAccumulatedFunding: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fUnitAccumulatedFunding']],
        ),
        fOpenInterest: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fOpenInterest']],
        ),
        fInitialMarginRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fInitialMarginRate']],
        ),
        fMaintenanceMarginRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMaintenanceMarginRate']],
        ),
        fIncentiveSpread: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fIncentiveSpread']],
        ),
        fTreasuryFeeRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fTreasuryFeeRate']],
        ),
        fPnLPartRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fPnLPartRate']],
        ),
        fReferralRebateCC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fReferralRebateCC']],
        ),
        fLiquidationPenaltyRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fLiquidationPenaltyRate']],
        ),
        fMinimalSpread: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMinimalSpread']],
        ),
        fMinimalSpreadInStress: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMinimalSpreadInStress']],
        ),
        fLotSizeBC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fLotSizeBC']],
        ),
        fFundingRateClamp: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fFundingRateClamp']],
        ),
        fMarkPriceEMALambda: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMarkPriceEMALambda']],
        ),
        fSigma2: ABK64x64ToFloat(response[0][fieldsToIndicesMap['fSigma2']]),
        fSigma3: ABK64x64ToFloat(response[0][fieldsToIndicesMap['fSigma3']]),
        fRho23: ABK64x64ToFloat(response[0][fieldsToIndicesMap['fRho23']]),
        fStressReturnS2_0: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fStressReturnS2']][0],
        ),
        fStressReturnS2_1: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fStressReturnS2']][1],
        ),
        fStressReturnS3_0: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fStressReturnS3']][0],
        ),
        fStressReturnS3_1: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fStressReturnS3']][1],
        ),
        fDFCoverNRate: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fDFCoverNRate']],
        ),
        fDFLambda_0: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fDFLambda']][0],
        ),
        fDFLambda_1: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fDFLambda']][1],
        ),
        fAMMTargetDD_0: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fAMMTargetDD']][0],
        ),
        fAMMTargetDD_1: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fAMMTargetDD']][1],
        ),
        fAMMMinSizeCC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fAMMMinSizeCC']],
        ),
        fMinimalTraderExposureEMA: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMinimalTraderExposureEMA']],
        ),
        fMaximalTradeSizeBumpUp: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMaximalTradeSizeBumpUp']],
        ),
        fMaxPositionBC: ABK64x64ToFloat(
          response[0][fieldsToIndicesMap['fMaxPositionBC']],
        ),
      }
    : initialPerpetualParameters;
};

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

export const getPerpetualTxContractName = (
  transaction?: PerpetualTx,
): ContractName => {
  if (!transaction) {
    return 'perpetualManager';
  }

  switch (transaction.method) {
    case PerpetualTxMethod.trade:
    case PerpetualTxMethod.deposit:
    case PerpetualTxMethod.withdraw:
    case PerpetualTxMethod.withdrawAll:
      return 'perpetualManager';
    case PerpetualTxMethod.createLimitOrder:
    case PerpetualTxMethod.cancelLimitOrder:
      return PerpetualPairDictionary.get(transaction.pair).limitOrderBook;
  }
};

const perpetualTradeArgs = (
  account: string,
  transaction: PerpetualTxTrade,
): Parameters<SendTxResponseInterface['send']>[0] => {
  const {
    isClosePosition = false,
    /** amount as wei string */
    price,
    amount,
    leverage = 1,
    slippage = PERPETUAL_SLIPPAGE_DEFAULT,
    tradingPosition = TradingPosition.LONG,
    pair: pairType,
  } = transaction;
  const pair = PerpetualPairDictionary.get(pairType);
  const signedAmount = getSignedAmount(tradingPosition, amount);
  const tradeDirection = Math.sign(signedAmount);

  const limitPrice = calculateSlippagePrice(
    numberFromWei(price),
    slippage,
    tradeDirection,
  );

  const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
  const timeNow = Math.round(Date.now() / 1000);

  let flags = MASK_MARKET_ORDER;

  if (isClosePosition) {
    flags = flags.or(MASK_CLOSE_ONLY);
  }

  if (transaction.keepPositionLeverage) {
    flags = flags.or(MASK_KEEP_POS_LEVERAGE);
  }

  const order = [
    pair.id,
    account,
    floatToABK64x64(signedAmount),
    floatToABK64x64(limitPrice),
    0,
    deadline,
    ethGenesisAddress,
    traderMgnTokenAddr, // TODO: This is only temporary, delete it once we have full support for BTCB as collateral
    flags,
    floatToABK64x64(leverage),
    timeNow,
  ];

  return [order];
};

const perpetualCreateLimitTradeArgs = async (
  account: string,
  transaction: PerpetualTxCreateLimitOrder,
): Promise<Parameters<SendTxResponseInterface['send']>[0]> => {
  const {
    tradingPosition = TradingPosition.LONG,
    amount,
    limit,
    trigger,
    expiry,
    created,
    leverage = 1,
    pair: pairType,
    reduceOnly,
  } = transaction;
  const pair = PerpetualPairDictionary.get(pairType);

  const signedAmount = getSignedAmount(tradingPosition, amount);

  const createdSeconds = Math.floor(created / 1000);
  const deadlineSeconds = createdSeconds + expiry * 24 * 60 * 60;

  let flags = MASK_LIMIT_ORDER;

  if (reduceOnly) {
    flags = flags.or(MASK_CLOSE_ONLY);
  }

  const order = {
    iPerpetualId: pair.id,
    traderAddr: account,
    fAmount: floatToABK64x64(signedAmount).toString(),
    fLimitPrice: weiToABK64x64(limit).toString(),
    fTriggerPrice: weiToABK64x64(trigger).toString(),
    iDeadline: deadlineSeconds,
    referrerAddr: ethGenesisAddress,
    traderMgnTokenAddr, // TODO: This is only temporary, delete it once we have full support for BTCB as collateral
    flags,
    fLeverage: floatToABK64x64(leverage).toString(),
    createdTimestamp: createdSeconds,
  };

  const digest = await createOrderDigest(
    order,
    true,
    getContract('perpetualManager').address,
    PERPETUAL_CHAIN_ID,
  );

  const signature = await walletService.request({
    method: 'personal_sign',
    params: [digest, account.toLowerCase()],
  });

  return [order, signature];
};

const perpetualCancelLimitTradeArgs = async (
  account: string,
  transaction: PerpetualTxCancelLimitOrder,
): Promise<Parameters<SendTxResponseInterface['send']>[0]> => {
  const { digest } = transaction;

  const contract = getContract(getPerpetualTxContractName(transaction));
  const order = await bridgeNetwork.call(
    PERPETUAL_CHAIN,
    contract.address,
    contract.abi,
    'orderOfDigest',
    [digest],
  );

  const cancelDigest = await createOrderDigest(
    order,
    false,
    getContract('perpetualManager').address,
    PERPETUAL_CHAIN_ID,
  );

  const signature = await walletService.request({
    method: 'personal_sign',
    params: [cancelDigest, account.toLowerCase()],
  });

  return [digest, signature];
};

export const perpetualTransactionArgs = async (
  pair: PerpetualPair,
  account: string,
  transaction: PerpetualTx,
): Promise<Parameters<SendTxResponseInterface['send']>[0]> => {
  switch (transaction.method) {
    case PerpetualTxMethod.trade:
      const tradeTx: PerpetualTxTrade = transaction;
      return perpetualTradeArgs(account, tradeTx);
    case PerpetualTxMethod.createLimitOrder:
      const createLimitTx: PerpetualTxCreateLimitOrder = transaction;
      return await perpetualCreateLimitTradeArgs(account, createLimitTx);
    case PerpetualTxMethod.cancelLimitOrder:
      const cancelLimitTx: PerpetualTxCancelLimitOrder = transaction;
      return await perpetualCancelLimitTradeArgs(account, cancelLimitTx);
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
