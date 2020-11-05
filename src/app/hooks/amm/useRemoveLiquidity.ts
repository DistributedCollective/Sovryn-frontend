import { Asset } from 'types/asset';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useRemoveLiquidity(
  asset: Asset,
  poolTokenAddress: string,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    asset === Asset.BTC ? 'liquidityBTCProtocol' : 'liquidityProtocol',
    'removeLiquidity',
  );

  return {
    withdraw: () =>
      send(
        asset === Asset.BTC
          ? getContract('liquidityProtocol').address
          : poolTokenAddress,
        amount,
        minReturn,
        {
          from: account,
        },
      ),
    ...rest,
  };
}
