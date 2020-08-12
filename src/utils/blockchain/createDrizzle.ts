import { Drizzle, generateStore } from '@drizzle/store';
import { createWeb3 } from './web3';
import { ContractNames, getContractsByName } from './contracts';

export const createDrizzle = (
  contractNames: ContractNames,
  // events?: Array<any>,
) => {
  const web3 = createWeb3();

  const contracts = getContractsByName(contractNames).map(item => ({
    contractName: item.contractName,
    web3Contract: new web3.eth.Contract(item.abi, item.address, {
      data: 'deployedBytecode',
    }),
  }));

  const options = { contracts, web3 };
  const drizzleStore = generateStore({ drizzleOptions: options as any });

  return new Drizzle(options as any, drizzleStore);
};
