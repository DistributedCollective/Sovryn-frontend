import { useAccount } from 'app/hooks/useAccount';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useMemo } from 'react';
import { PERPETUAL_GAS_PRICE_DEFAULT } from '../types';
import { Asset, Chain } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useBridgeNetworkSendTx } from '../../../hooks/useBridgeNetworkSendTx';

export const usePerpetual_withdrawAll = (pairType: PerpetualPairType) => {
  const account = useAccount();
  const perpetualId = useMemo(() => PerpetualPairDictionary.get(pairType)?.id, [
    pairType,
  ]);

  const { send, ...rest } = useBridgeNetworkSendTx(
    Chain.BSC,
    'perpetualManager',
    'withdrawAll',
  );

  return useMemo(
    () => ({
      withdraw: async (nonce?: number, customData?: PerpetualTx) => {
        send(
          [perpetualId],
          {
            from: account,
            gas: gasLimit[TxType.PERPETUAL_WITHDRAW_COLLATERAL],
            gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
            nonce,
          },
          {
            type: TxType.PERPETUAL_WITHDRAW_COLLATERAL,
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
    }),
    [perpetualId, account, send, rest],
  );
};
