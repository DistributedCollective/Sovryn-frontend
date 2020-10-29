import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useBorrow(
  asset: Asset,
  loanId,
  withdrawAmount,
  initialLoanDuration,
  collateralTokenSent,
  collateralToken: Asset,
  borrower,
  receiver,
  loanDataBytes,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'borrow',
  );

  return {
    borrow: () => {
      return send(
        loanId,
        withdrawAmount,
        initialLoanDuration,
        collateralTokenSent,
        getTokenContract(collateralToken).address,
        borrower,
        receiver,
        loanDataBytes,
        {
          from: account,
          value: asset === Asset.BTC ? collateralTokenSent : '0',
        },
      );
    },
    ...rest,
  };
}
