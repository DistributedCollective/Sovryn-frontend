import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useMarginTrade(
  asset: Asset,
  loanId,
  leverageAmount,
  loanTokenSent,
  collateralTokenSent,
  collateralTokenAddress,
  trader,
  loanDataBytes,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'marginTrade',
  );

  return {
    trade: () =>
      send(
        loanId,
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress,
        trader,
        loanDataBytes,
        { from: account },
      ),
    ...rest,
  };
}
