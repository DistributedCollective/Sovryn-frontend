import { useMemo, useContext, useCallback } from 'react';
import {
  PerpetualTx,
  PerpetualTxMethod,
} from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  PERPETUAL_CHAIN,
  PERPETUAL_PAYMASTER,
  PERPETUAL_GAS_PRICE_DEFAULT,
} from '../types';
import { perpetualTransactionArgs } from '../utils/contractUtils';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { useAccount } from '../../../hooks/useAccount';
import { TxType } from '../../../../store/global/transactions-store/types';
import { gasLimit } from '../../../../utils/classifiers';
import { ContractName } from '../../../../utils/types/contracts';

const PerpetualTxMethodMap: { [key in PerpetualTxMethod]: string } = {
  [PerpetualTxMethod.trade]: 'trade',
  [PerpetualTxMethod.limitOrder]: 'createLimitOrder',
  [PerpetualTxMethod.deposit]: 'deposit',
  [PerpetualTxMethod.withdraw]: 'withdraw',
  [PerpetualTxMethod.withdrawAll]: 'withdrawAll',
};

const PerpetualTxMethodTypeMap: { [key in PerpetualTxMethod]: TxType } = {
  [PerpetualTxMethod.trade]: TxType.PERPETUAL_TRADE,
  [PerpetualTxMethod.limitOrder]: TxType.PERPETUAL_LIMIT_ORDER,
  [PerpetualTxMethod.deposit]: TxType.PERPETUAL_DEPOSIT_COLLATERAL,
  [PerpetualTxMethod.withdraw]: TxType.PERPETUAL_WITHDRAW_COLLATERAL,
  [PerpetualTxMethod.withdrawAll]: TxType.PERPETUAL_WITHDRAW_COLLATERAL,
};

const PerpetualTxMethodContractMap: {
  [key in PerpetualTxMethod]: ContractName;
} = {
  [PerpetualTxMethod.trade]: 'perpetualManager',
  [PerpetualTxMethod.limitOrder]: 'perpetualLimitOrderBook',
  [PerpetualTxMethod.deposit]: 'perpetualManager',
  [PerpetualTxMethod.withdraw]: 'perpetualManager',
  [PerpetualTxMethod.withdrawAll]: 'perpetualManager',
};

export const usePerpetual_transaction = (
  transaction: PerpetualTx | undefined,
  useGSN: boolean,
) => {
  const account = useAccount();
  const perpetualsContext = useContext(PerpetualQueriesContext);

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(
        transaction?.pair || PerpetualPairType.BTCUSD,
      ),
    [transaction?.pair],
  );

  const { send, ...rest } = useGsnSendTx(
    PERPETUAL_CHAIN,
    transaction
      ? PerpetualTxMethodContractMap[transaction.method]
      : 'perpetualManager',
    transaction ? PerpetualTxMethodMap[transaction.method] : '',
    PERPETUAL_PAYMASTER,
    useGSN,
  );

  const execute = useCallback(
    async (nonce?: number) => {
      if (!transaction) {
        throw Error('No transaction given to execute!');
      }

      let txType: TxType = PerpetualTxMethodTypeMap[transaction.method];

      return send(
        await perpetualTransactionArgs(
          perpetualsContext,
          pair,
          account,
          transaction,
        ),
        {
          from: account,
          gas: gasLimit[txType],
          gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
          nonce: nonce,
        },
        {
          type: txType,
          asset: pair.collateralAsset,
          customData: transaction,
        },
      );
    },
    [transaction, account, perpetualsContext, pair, send],
  );

  return useMemo(() => {
    return {
      execute,
      ...rest,
    };
  }, [execute, rest]);
};
