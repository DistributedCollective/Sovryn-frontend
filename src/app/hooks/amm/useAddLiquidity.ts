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
    'liquidityProtocol',
    'addLiquidity',
  );

  return {
    deposit: () => {
      return send(getTokenContract(asset).address, amount, minReturn, {
        from: account,
      });
    },
    ...rest,
  };
}
