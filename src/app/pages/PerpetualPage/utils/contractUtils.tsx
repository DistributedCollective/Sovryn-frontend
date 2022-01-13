import React from 'react';
import { walletService } from '@sovryn/react-wallet';
import { BigNumber } from 'ethers';
import { Asset, Chain } from 'types';
import { Sovryn } from 'utils/sovryn';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { ContractName } from 'utils/types/contracts';
import { actions as txActions } from 'store/global/transactions-store/slice';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { getContract } from 'utils/blockchain/contract-helpers';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { TradingPosition } from 'types/trading-position';
import {
  TraderState,
  AMMState,
  PerpParameters,
  calculateSlippagePriceFromMidPrice,
  getPrice,
  getMidPrice,
  isTraderInitialMarginSafe,
  getRequiredMarginCollateralWithGasFees,
} from './perpUtils';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { CheckAndApproveResultWithError } from '../types';
import { BridgeNetworkDictionary } from '../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Trans } from 'react-i18next';
import { translations } from '../../../../locales/i18n';
import { numberToPercent } from '../../../../utils/display-text/format';

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
