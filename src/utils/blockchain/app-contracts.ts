import { contracts } from 'utils/blockchain/contracts';

import { isMainnet, currentChainId } from 'utils/classifiers';
import { toChecksumAddress } from '../helpers';
import { ContractData } from '../types/contracts';

const FIRST_BLOCK = isMainnet ? 2758025 : 1000000;
const fixContracts = () => {
  return Object.keys(contracts).reduce<ContractData>((acc, key) => {
    if (contracts.hasOwnProperty(key)) {
      const item = contracts[key];
      const chainId = item.chainId || currentChainId;
      const isRSK = chainId === currentChainId;

      acc[key] = {
        address: isRSK ? toChecksumAddress(item.address) : item.address,
        abi: item.abi,
        blockNumber: item.blockNumber || FIRST_BLOCK,
        chainId,
      };
    }
    return acc;
  }, {});
};

export const appContracts: ContractData = fixContracts();
