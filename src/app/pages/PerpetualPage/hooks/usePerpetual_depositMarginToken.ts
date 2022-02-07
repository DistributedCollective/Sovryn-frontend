import { useAccount } from 'app/hooks/useAccount';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { weiToABK64x64 } from '../utils/contractUtils';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useMemo } from 'react';
import { PERPETUAL_GAS_PRICE_DEFAULT } from '../types';
import { Asset, Chain } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useBridgeNetworkSendTx } from '../../../hooks/useBridgeNetworkSendTx';

export const usePerpetual_depositMarginToken = (
  pairType: PerpetualPairType,
) => {
  const account = useAccount();
  const perpetualId = useMemo(() => PerpetualPairDictionary.get(pairType)?.id, [
    pairType,
  ]);

  const { send, ...rest } = useBridgeNetworkSendTx(
    Chain.BSC,
    'perpetualManager',
    'deposit',
  );

  return {
    deposit: async (
      amount: string,
      nonce?: number,
      customData?: PerpetualTx,
    ) => {
      await send(
        [perpetualId, weiToABK64x64(amount)],
        {
          from: account,
          gas: gasLimit[TxType.PERPETUAL_DEPOSIT_COLLATERAL],
          gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
          nonce: nonce,
        },
        {
          type: TxType.PERPETUAL_DEPOSIT_COLLATERAL,
          asset: Asset.BTCS,
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
