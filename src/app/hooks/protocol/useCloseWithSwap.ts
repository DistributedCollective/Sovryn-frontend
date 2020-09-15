import {
  SendTxResponseInterface,
  useSendContractTx,
} from '../useSendContractTx';
import { useAccount } from '../useAccount';
import Web3 from 'web3-utils';

export function useCloseWithSwap(
  loanId,
  receiver,
  swapAmount,
  returnTokenIsCollateral,
  loanDataBytes,
): SendTxResponseInterface {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'closeWithSwap',
  );

  return {
    send: () =>
      send(
        loanId,
        receiver,
        swapAmount,
        Web3.toHex(returnTokenIsCollateral),
        loanDataBytes,
        { from: account },
      ),
    ...rest,
  };
}
