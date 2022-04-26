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
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';

export const usePerpetual_withdrawAll = (useGSN: boolean) => {
  const account = useAccount();

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
        const pair = PerpetualPairDictionary.get(
          customData?.pair || PerpetualPairType.BTCUSD,
        );
        send(
          [pair.id],
          {
            from: account,
            gas: gasLimit[TxType.PERPETUAL_WITHDRAW_COLLATERAL],
            gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
            nonce,
          },
          {
            type: TxType.PERPETUAL_WITHDRAW_COLLATERAL,
            asset: pair.collateralAsset,
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
    [account, send, rest],
  );
};
