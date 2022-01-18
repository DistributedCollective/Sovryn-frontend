import { RelayProvider } from '@opengsn/provider';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { walletService } from '@sovryn/react-wallet';
import { ChainId } from 'types';
import { RpcNode } from '../blockchain/rpc-node';
import { RpcNetwork } from '../blockchain/rpc-network';
import type { Contract } from 'web3-eth-contract';
import type { TransactionConfig } from 'web3-core';
import type { Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';

const preferredRelays = {
  [ChainId.BSC_MAINNET]: ['https://bsc.relay.sovryn.app/gsn1'],
  [ChainId.BSC_TESTNET]: ['https://tbsc.relay.sovryn.app/gsn1'],
};

export interface GsnTransactionConfig extends TransactionConfig {
  /** defaults to true when undefined */
  useGSN?: boolean;
}

export class GsnWrapper {
  private _isReady: boolean = false;

  private _provider?: RelayProvider;
  private _web3?: Web3;
  private _contracts: Record<string, Contract> = {};

  public constructor(chainId: ChainId, paymasterAddress: string) {
    RelayProvider.newProvider({
      provider: new GsnRpcNodeWrapper(RpcNetwork.get(chainId)),
      config: {
        paymasterAddress,
        preferredRelays: preferredRelays[chainId],
        loggerConfiguration: {
          logLevel: 'debug',
        },
      },
    })
      .init()
      .then(result => {
        this._provider = result;
        this._web3 = new Web3(this._provider);
        this._isReady = true;
      });
  }

  public get isReady() {
    return this._isReady;
  }

  public send(
    address: string,
    abi: AbiItem | AbiItem[],
    method: string,
    args: any[] = [],
    config: TransactionConfig = {},
  ) {
    this.doCheck();
    return this.getContract(address, abi)
      .methods[method](...args)
      .send({
        from: walletService.address.toLowerCase(),
        ...config,
      });
  }

  public call(
    address: string,
    abi: AbiItem | AbiItem[],
    method: string,
    args: any[] = [],
    config: GsnTransactionConfig = {},
  ) {
    this.doCheck();
    return this.getContract(address, abi)
      .methods[method](...args)
      .call({ from: walletService.address.toLowerCase(), ...config });
  }

  protected doCheck() {
    if (!this.isReady) {
      throw new Error('RelayProvider is not yet ready!');
    }
  }

  protected getContract(address: string, abi: AbiItem | AbiItem[]): Contract {
    if (this._contracts.hasOwnProperty(address)) {
      return this._contracts[address];
    }
    if (this._web3) {
      this._contracts[address] = new this._web3.eth.Contract(abi, address);
      return this._contracts[address];
    }
    throw new Error('Contract is not ready!');
  }
}

class GsnRpcNodeWrapper implements Web3ProviderBaseInterface {
  constructor(private provider: RpcNode) {}

  send(
    payload: JsonRpcPayload,
    callback: (error: Error | null, result?: JsonRpcResponse) => void,
  ): void {
    this.provider
      .send(payload)
      .then(result => callback(null, result))
      .catch(error => callback(error, undefined));
  }
}
