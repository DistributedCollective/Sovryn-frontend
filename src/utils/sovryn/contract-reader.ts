import type { RevertInstructionError } from 'web3-core-helpers';
import type { TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { debug } from '../debug';
import {
  CacheCallOptions,
  idHash,
  observeCall,
  startCall,
} from 'utils/blockchain/cache';
import { firstValueFrom } from 'rxjs';
import { getContract } from 'utils/blockchain/contract-helpers';

const { error } = debug('reader');

const TINY_TTL = 300; // 0.3 seconds

class ContractReader {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  public async nonce(address: string): Promise<number> {
    const id = idHash(['nonce', address]);
    const result$ = observeCall(id);

    startCall(
      id,
      () => this.sovryn.getWeb3().eth.getTransactionCount(address, 'pending'),
      {
        ttl: TINY_TTL,
      },
    );

    return (await firstValueFrom(result$)).promise.then(e => {
      if (e instanceof Error) {
        error('nonce', e);
        throw e;
      }
      return e;
    });
  }

  public async blockNumber(): Promise<number> {
    const result$ = observeCall('blockNumber');

    startCall('blockNumber', () => this.sovryn.getWeb3().eth.getBlockNumber(), {
      ttl: TINY_TTL,
    });

    return (await firstValueFrom(result$)).promise.then(e => {
      if (e instanceof Error) {
        error('blockNumber', e);
        throw e;
      }
      return e;
    });
  }

  public async call<T = string | RevertInstructionError>(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    account?: string,
    cacheOptions?: CacheCallOptions,
  ): Promise<T> {
    const hashedId = idHash([
      getContract(contractName).address,
      methodName,
      args,
    ]);

    const result$ = observeCall(hashedId);

    startCall(
      hashedId,
      () => this.callDirect(contractName, methodName, args, account),
      cacheOptions,
    );

    return (await firstValueFrom(result$)).promise.then(e => {
      if (e instanceof Error) {
        error('call', { contractName, methodName, args }, e);
        throw e;
      }
      return e;
    });
  }

  public async callDirect<T = string | RevertInstructionError>(
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

  public async callByAddress<T = string | RevertInstructionError>(
    address: string,
    abi: AbiItem[] | AbiItem | any,
    methodName: string,
    args: Array<any>,
    cacheOptions?: CacheCallOptions,
  ): Promise<T> {
    const hashedId = idHash([address, methodName, args]);

    const result$ = observeCall(hashedId);

    startCall(
      hashedId,
      () => this.callByAddressDirect(address, abi, methodName, args),
      cacheOptions,
    );

    return (await firstValueFrom(result$)).promise.then(e => {
      if (e instanceof Error) {
        error('callByAddresss', { address, methodName, args }, e);
        throw e;
      }
      return e;
    });
  }

  public async callByAddressDirect<T = string | RevertInstructionError>(
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
        error('callByAddresssDirect', { address, methodName, args }, e);
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
}

export const contractReader = new ContractReader();
