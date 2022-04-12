import { useAccount } from 'app/hooks/useAccount';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { weiToABK64x64 } from '../utils/contractUtils';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  PERPETUAL_GAS_PRICE_DEFAULT,
  PERPETUAL_PAYMASTER,
  PERPETUAL_CHAIN,
} from '../types';
import { Asset } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';

export const usePerpetual_depositMarginToken = (useGSN: boolean) => {
  const account = useAccount();

  const { send, ...rest } = useGsnSendTx(
    PERPETUAL_CHAIN,
    'perpetualManager',
    'deposit',
    PERPETUAL_PAYMASTER,
    useGSN,
  );

  return {
    deposit: async (
      amount: string,
      nonce?: number,
      customData?: PerpetualTx,
    ) => {
      const perpetualId = PerpetualPairDictionary.get(
        customData?.pair || PerpetualPairType.BTCUSD,
      )?.id;
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
