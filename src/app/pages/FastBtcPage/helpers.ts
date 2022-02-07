import { Asset, Chain } from 'types';
import { currentNetwork } from 'utils/classifiers';
import { contracts, FastBTCWithdrawContractName } from './config/contracts';

export const getBTCAssetForNetwork = (network: Chain) => {
  return network === Chain.BSC ? Asset.BTCS : Asset.RBTC;
};

export const getFastBTCWithdrawalContract = (
  chain: Chain,
  contractName: FastBTCWithdrawContractName,
) => {
  const contract = contracts[contractName];
  if (!contract) {
    throw new Error(
      `Contract ${contractName} does not exist for fast-btc withdrawals.`,
    );
  }

  if (!contract.address?.[chain]?.[currentNetwork]) {
    throw new Error(
      `Contract ${contractName} does is not defined for ${chain} on ${currentNetwork}`,
    );
  }

  return {
    address: contract.address[chain]?.[currentNetwork] as string,
    abi: contract.abi,
  };
};
