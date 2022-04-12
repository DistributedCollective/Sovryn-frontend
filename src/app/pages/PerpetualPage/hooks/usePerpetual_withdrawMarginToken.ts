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
  PERPETUAL_CHAIN,
  PERPETUAL_PAYMASTER,
} from '../types';
import { Asset } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';

export const usePerpetual_withdrawMarginToken = (useGSN: boolean) => {
  const account = useAccount();

  const { send, ...rest } = useGsnSendTx(
    PERPETUAL_CHAIN,
    'perpetualManager',
    'withdraw',
    PERPETUAL_PAYMASTER,
    useGSN,
  );

  return {
    withdraw: async (
      amount: string,
      nonce?: number,
      customData?: PerpetualTx,
    ) => {
      const perpetualId = PerpetualPairDictionary.get(
        customData?.pair || PerpetualPairType.BTCUSD,
      )?.id;
      send(
        [perpetualId, weiToABK64x64(amount)],
        {
          from: account,
          gas: gasLimit[TxType.PERPETUAL_WITHDRAW_COLLATERAL],
          gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
          nonce,
        },
        {
          type: TxType.PERPETUAL_WITHDRAW_COLLATERAL,
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
