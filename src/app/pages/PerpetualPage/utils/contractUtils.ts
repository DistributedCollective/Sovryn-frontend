import { walletService } from '@sovryn/react-wallet';
import { BigNumber } from 'ethers';
import { Asset, Chain } from 'types';
import { Sovryn } from 'utils/sovryn';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { ContractName } from 'utils/types/contracts';
import { actions as txActions } from 'store/global/transactions-store/slice';
import { bignumber } from 'mathjs';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { transferAmount } from 'utils/blockchain/transfer-approve-amount';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { getContract } from 'utils/blockchain/contract-helpers';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { TradingPosition } from 'types/trading-position';
import { TraderState, getBase2CollateralFX, AMMState } from './perpUtils';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';

export const ONE_64x64 = BigNumber.from('0x10000000000000000');

// TODO: remove and replace with id from PerpetualPair
export const PERPETUAL_ID =
  '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d';

export const getTradeDirection = (tradingPosition: TradingPosition) =>
  tradingPosition === TradingPosition.LONG ? 1 : -1;

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
  const dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  const decimalPartBigNumber = decimalPart.mul(ONE_64x64).div(dec18);

  return integerPartBigNumber.add(decimalPartBigNumber).mul(sign);
};

export const ABK64x64ToWei = (value: BigNumber) => {
  const sign = value.lt(0) ? -1 : 1;
  value = value.mul(sign);
  const integerPart = value.div(ONE_64x64);
  let decimalPart = value.sub(integerPart.mul(ONE_64x64));
  const dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  decimalPart = decimalPart.mul(dec18).div(ONE_64x64);
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
  const dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  decimalPart = decimalPart.mul(dec18).div(ONE_64x64);
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
): Promise<CheckAndApproveResult> => {
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
    if (bignumber(String(allowance)).lessThan(amount)) {
      dispatch(
        txActions.openTransactionRequestDialog({
          type: TxType.APPROVE,
          asset,
          amount: transferAmount.get(amount),
        }),
      );
      approveTx = await contractWriter
        .send(
          contractName,
          'approve',
          [spenderAddress, transferAmount.get(amount)],
          {
            nonce,
            from: address,
            gas: 60000,
            gasPrice: approveGasPrice,
          },
        )
        .then(tx => {
          sovryn.store().dispatch(
            txActions.addTransaction({
              transactionHash: tx as string,
              approveTransactionHash: null,
              type: TxType.APPROVE,
              status: TxStatus.PENDING,
              loading: false,
              to: contractName,
              from: address,
              value: '0',
              asset,
              assetAmount: transferAmount.get(amount),
            }),
          );
          return tx;
        });
      nonce += 1;
    }
    dispatch(txActions.setLoading(false));
    dispatch(txActions.closeTransactionRequestDialog());
    return {
      approveTx,
      nonce,
      rejected: false,
    };
  } catch (e) {
    dispatch(txActions.setLoading(false));
    dispatch(txActions.setTransactionRequestDialogError(e.message));
    return {
      approveTx: null,
      nonce,
      rejected: true,
    };
  }
};

export const calculateMaxMarginWithdrawal = (
  pair: PerpetualPair | undefined,
  traderState: TraderState,
  ammState: AMMState,
) => {
  const requiredMargin =
    (Math.abs(traderState.marginAccountPositionBC) *
      getBase2CollateralFX(ammState, true)) /
    (pair?.config.leverage.max || 1);
  return traderState.availableCashCC - requiredMargin;
};
