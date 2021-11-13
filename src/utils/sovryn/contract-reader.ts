import type { RevertInstructionError } from 'web3-core-helpers';
import type { TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { debug } from '../debug';

const { error } = debug('reader');

class ContractReader {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  public async nonce(address: string) {
    return this.sovryn
      .getWeb3()
      .eth.getTransactionCount(address, 'pending')
      .catch(e => {
        error('nonce', e);
        throw e;
      });
  }

  public async blockNumber() {
    return this.sovryn
      .getWeb3()
      .eth.getBlockNumber()
      .catch(e => {
        error('blockNumber', e);
        throw e;
      });
  }

  /**
   * Call contract and return response string or revert error
   * @param contractName
   * @param methodName
   * @param args
   * @param account
   */
  public async call<T = string | RevertInstructionError>(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    account?: string,
  ): Promise<T> {
    return this.sovryn.contracts[contractName].methods[methodName](...args)
      .call({ from: account })
      .catch(e => {
        error('call', { contractName, methodName, args }, e);
        throw e;
      });
  }

  public async callAsync<T = string | RevertInstructionError>(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    account?: string,
  ): Promise<T> {
    return this.sovryn.contracts[contractName].methods[methodName](...args)
      .callAsync({ from: account })
      .catch(e => {
        error('callAsync', { contractName, methodName, args }, e);
        throw e;
      });
  }

  public async callByAddress<T = string | RevertInstructionError>(
    address: string,
    abi: AbiItem[] | AbiItem | any,
    methodName: string,
    args: Array<any>,
  ): Promise<T> {
    const Contract = this.sovryn.getWeb3().eth.Contract;
    if (!this.sovryn.getWeb3()) return '' as any;
    const contract = new Contract(abi, address);
    return contract.methods[methodName](...args)
      .call()
      .catch(e => {
        error('callByAddresss', { address, methodName, args }, e);
        throw e;
      });
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
    return contract.methods[methodName](...args)
      .estimateGas(config)
      .catch(e => {
        error('estimateGas', { address, methodName, args }, e);
        throw e;
      });
  }
}

export const contractReader = new ContractReader();
