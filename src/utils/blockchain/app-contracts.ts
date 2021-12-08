import { contracts } from 'utils/blockchain/contracts';

import { isMainnet } from 'utils/classifiers';
import { toChecksumAddress } from '../helpers';
import { ContractData } from '../types/contracts';

const FIRST_BLOCK = isMainnet ? 2758025 : 1000000;
const fixContracts = () => {
  const newObj = {};
  const keys = Object.keys(contracts);
  keys.forEach(key => {
    if (contracts.hasOwnProperty(key)) {
      const item = contracts[key];
      newObj[key] = {
        address: toChecksumAddress(item.address),
        abi: item.abi,
        blockNumber: item.blockNumber || FIRST_BLOCK,
      };
    }
  });
  return newObj;
};

export const appContracts: ContractData = fixContracts();
