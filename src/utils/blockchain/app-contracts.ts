import { contracts } from 'utils/blockchain/contracts';

import { currentChainId, currentNetwork } from 'utils/classifiers';
import { toChecksumAddress } from '../helpers';
import { ContractData } from '../types/contracts';

const FIRST_BLOCK = currentNetwork === 'mainnet' ? 2758025 : 1000000;
const fixContracts = () => {
  const newObj = {};
  const keys = Object.keys(contracts);
  keys.forEach(key => {
    if (contracts.hasOwnProperty(key)) {
      const item = contracts[key];
      const chainId = item.chainId || currentChainId;
      const isRSK = chainId === currentChainId;
      newObj[key] = {
        address: isRSK
          ? toChecksumAddress(item.address)
          : item.address.toLowerCase(),
        abi: item.abi,
        blockNumber: item.blockNumber || FIRST_BLOCK,
        chainId,
      };
    }
  });
  return newObj;
};

export const appContracts: ContractData = fixContracts();
