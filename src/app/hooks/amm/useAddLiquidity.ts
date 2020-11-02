import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
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
      const args = [
        getTokenContract(asset).address,
        amount,
        minReturn,
        {
          from: account,
          value: Asset.BTC ? amount : '0',
        },
      ];

      if (asset === Asset.BTC) {
        args.shift();
      }

      return send(...args);
    },
    ...rest,
  };
}
