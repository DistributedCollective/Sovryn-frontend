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
  loadDataBytes,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'marginTrade',
  );
  //
  // console.log(
  //   'trade data',
  //   'asset', asset,
  //   'loan id', loanId,
  //   'levelrage', leverageAmount,
  //   'loan token sent', loanTokenSent,
  //   'col loan sent', collateralTokenSent,
  //   'col token address', collateralTokenAddress,
  //   'trader', trader,
  //   'bytes', loadDataBytes,
  // );

  return {
    trade: () =>
      send(
        loanId,
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress,
        trader,
        loadDataBytes,
        { from: account },
      ),
    ...rest,
  };
}
