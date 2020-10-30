import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useBorrow(
  borrowToken: Asset,
  loanId,
  withdrawAmount,
  initialLoanDuration,
  collateralTokenSent,
  collateralToken: Asset,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(borrowToken),
    'borrow',
  );

  console.log('borrow', rest);

  return {
    borrow: () => {
      return send(
        loanId,
        withdrawAmount,
        initialLoanDuration,
        collateralTokenSent,
        getTokenContract(collateralToken).address,
        account, // borrower
        account, // receiver
        '0x', // loanDataBytes
        {
          from: account,
          value: collateralToken === Asset.BTC ? collateralTokenSent : '0',
        },
      );
    },
    ...rest,
  };
}
