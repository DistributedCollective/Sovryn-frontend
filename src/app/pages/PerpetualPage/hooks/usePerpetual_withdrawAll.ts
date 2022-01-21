import { useAccount } from 'app/hooks/useAccount';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useMemo } from 'react';
import {
  PERPETUAL_GAS_PRICE_DEFAULT,
  PERPETUAL_CHAIN,
  PERPETUAL_PAYMASTER,
} from '../types';
import { Asset } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';

export const usePerpetual_withdrawAll = (
  pairType: PerpetualPairType,
  useGSN: boolean,
) => {
  const account = useAccount();
  const perpetualId = useMemo(() => PerpetualPairDictionary.get(pairType)?.id, [
    pairType,
  ]);

  const { send, ...rest } = useGsnSendTx(
    PERPETUAL_CHAIN,
    'perpetualManager',
    'withdrawAll',
    PERPETUAL_PAYMASTER,
    useGSN,
  );

  return useMemo(
    () => ({
      withdraw: async (nonce?: number, customData?: PerpetualTx) => {
        send(
          [perpetualId],
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
    }),
    [perpetualId, account, send, rest],
  );
};
