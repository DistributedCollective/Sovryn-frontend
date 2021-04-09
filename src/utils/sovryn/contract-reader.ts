import type { RevertInstructionError } from 'web3-core-helpers';
import type { TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';

class ContractReader {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  public async nonce(address: string) {
    return this.sovryn.getWeb3().eth.getTransactionCount(address);
  }

  /**
   * Call contract and return response string or revert error
   * @param contractName
   * @param methodName
   * @param args
   */
  public async call<T = string | RevertInstructionError>(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
  ): Promise<T> {
    return this.sovryn.contracts[contractName].methods[methodName](
      ...args,
    ).call();
  }

  public async callByAddress<T = string | RevertInstructionError>(
    address: string,
    abi: AbiItem,
    methodName: string,
    args: Array<any>,
  ): Promise<T> {
    const Contract = this.sovryn.getWeb3().eth.Contract;
    if (!this.sovryn.getWeb3()) return '' as any;
    const contract = new Contract(abi, address);
    return contract.methods[methodName](...args).call();
  }

  public async estimateGas(
    address: string,
    abi: AbiItem[] | AbiItem,
    methodName: string,
    args: Array<any>,
    config: TransactionConfig,
  ): Promise<number> {
    const Contract = this.sovryn.getWeb3().eth.Contract;
    if (!this.sovryn.getWeb3()) return '' as any;
    const contract = new Contract(abi, address);
    return contract.methods[methodName](...args).estimateGas(config);
  }
}

export const contractReader = new ContractReader();
