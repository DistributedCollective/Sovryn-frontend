import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { weiToABK64x64 } from '../utils/contractUtils';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useMemo } from 'react';
import { PERPETUAL_GAS_PRICE_DEFAULT } from '../types';
import { Asset } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';

export const usePerpetual_withdrawMarginToken = (
  pairType: PerpetualPairType,
) => {
  const account = useAccount();
  const perpetualId = useMemo(() => PerpetualPairDictionary.get(pairType)?.id, [
    pairType,
  ]);
  const { send, ...rest } = useSendContractTx('perpetualManager', 'withdraw');

  return {
    withdraw: async (
      amount: string,
      nonce?: number,
      customData?: PerpetualTx,
    ) => {
      send(
        [perpetualId, weiToABK64x64(amount)],
        {
          from: account,
          gas: gasLimit[TxType.WITHDRAW_COLLATERAL],
          gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
          nonce,
        },
        {
          type: TxType.WITHDRAW_COLLATERAL,
          asset: Asset.PERPETUALS,
          customData,
        },
      );
    },
    txData: rest.txData,
    txHash: rest.txHash,
    loading: rest.loading,
    status: rest.status,
    reset: rest.reset,
  };
};
