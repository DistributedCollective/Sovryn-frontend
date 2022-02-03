import { RelayProvider } from '@opengsn/provider';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { walletService } from '@sovryn/react-wallet';
import { ChainId } from 'types';
import type { Contract } from 'web3-eth-contract';
import type { TransactionConfig } from 'web3-core';
import { gsnNetwork } from './GsnNetwork';
import { SovrynWalletGsnProvider } from './SovrynWalletGsnProvider';
import { RpcNetwork } from 'utils/blockchain/rpc-network';
import { gasLimit } from '../classifiers';

const preferredRelays = {
  [ChainId.BSC_MAINNET]: ['https://bsc.relay.sovryn.app/gsn1'],
  [ChainId.BSC_TESTNET]: ['https://tbsc.relay.sovryn.app/gsn1'],
};

const MAX_EVENT_BLOCKS = 5000;

export interface GsnTransactionConfig extends TransactionConfig {
  /** defaults to true when undefined */
  useGSN?: boolean;
}

export class GsnProvider {
  private _isReady: boolean | Promise<boolean> = false;

  private _provider?: RelayProvider;
  private _web3?: Web3;
  private _contracts: Record<string, Contract> = {};

  public constructor(private chainId: ChainId, paymasterAddress: string) {
    this._isReady = new Promise((resolve, reject) => {
      RelayProvider.newProvider({
        provider: new SovrynWalletGsnProvider(RpcNetwork.get(chainId)),
        config: {
          paymasterAddress,
          preferredRelays: preferredRelays[chainId],
          relayLookupWindowBlocks: MAX_EVENT_BLOCKS,
          relayRegistrationLookupBlocks: MAX_EVENT_BLOCKS,
          pastEventsQueryMaxPageSize: MAX_EVENT_BLOCKS,
          maxViewableGasLimit: Math.max(...Object.values(gasLimit)),
          loggerConfiguration: {
            logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
          },
        },
      })
        .init()
        .then(result => {
          this._provider = result;
          this._web3 = new Web3(this._provider);
          this._isReady = true;
          resolve(true);
        })
        .catch(error => {
          console.error(error);
          resolve(false);
        });
    });
  }

  public get isReady() {
    return this._isReady;
  }

  public isSupported() {
    return (
      walletService.connected &&
      walletService.chainId === this.chainId &&
      gsnNetwork.isSupportedByConnectedWallet()
    );
  }

  public send(
    address: string,
    abi: AbiItem | AbiItem[],
    method: string,
    args: any[] = [],
    config: TransactionConfig = {},
  ) {
    this.doCheck();
    return new Promise((resolve, reject) => {
      this.getContract(address, abi)
        .methods[method](...args)
        .send({
          from: walletService.address.toLowerCase(),
          ...config,
        })
        .once('transactionHash', resolve)
        .catch(reject);
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
    if (!this.isSupported()) {
      throw new Error(
        'RelayProvider is not supported by connected wallet or wallet has wrong network selected!',
      );
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
