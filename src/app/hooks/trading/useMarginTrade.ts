import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useMarginTrade(
  asset: Asset,
  loanId,
  leverageAmount,
  loanTokenSent,
  collateralTokenSent,
  collateralToken: Asset,
  trader,
  loanDataBytes,
  weiAmount: string = '0',
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'marginTrade',
  );

  return {
    trade: () => {
      return send(
        loanId,
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        getTokenContract(collateralToken).address,
        trader,
        loanDataBytes,
        {
          from: account,
          value: weiAmount,
        },
      );
    },
    ...rest,
  };
}
