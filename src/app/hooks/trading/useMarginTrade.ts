import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { toWei } from 'web3-utils';

export function useMarginTrade(
  asset: Asset,
  loanId,
  leverageAmount,
  loanTokenSent,
  collateralTokenSent,
  collateralToken,
  trader,
  loanDataBytes,
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
          value:
            collateralToken === Asset.BTC ? collateralTokenSent : toWei('0'),
        },
      );
    },
    ...rest,
  };
}
