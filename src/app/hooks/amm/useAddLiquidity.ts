import { Asset } from 'types/asset';
import {
  getContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useAddLiquidity(
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    asset === Asset.BTC ? 'liquidityBTCProtocol' : 'liquidityProtocol',
    'addLiquidity',
  );

  return {
    deposit: () => {
      return send(
        asset === Asset.BTC
          ? getContract('liquidityProtocol').address
          : getTokenContract(asset).address,
        amount,
        minReturn,
        {
          from: account,
          value: asset === Asset.BTC ? amount : '0',
        },
      );
    },
    ...rest,
  };
}
