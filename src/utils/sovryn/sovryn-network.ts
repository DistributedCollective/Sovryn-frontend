import { store } from '../../store/store';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import { rpcNodes, wsNodes } from '../classifiers';
import { Toaster } from '@blueprintjs/core';
import { put } from 'redux-saga/effects';
import { actions } from '../../app/containers/WalletProvider/slice';
import { WalletProviderState } from '../../app/containers/WalletProvider/types';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal, { IProviderOptions } from 'web3modal';

export class SovrynNetwork {
  private static _instance?: SovrynNetwork;
  private _store = store;

  private _web3Modal: Web3Modal;
  private _providerOptions: IProviderOptions = {
    walletconnect: {
      display: {
        // logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
        name: 'Mobile',
        description: 'Scan qrcode with your mobile wallet',
      },
      package: WalletConnectProvider,
      options: {
        rpc: rpcNodes,
      },
    },
  };
  private _provider = null;
  private _writeWeb3: Web3 = null as any;
  private _readWeb3: Web3 = null as any;
  private _toaster = Toaster.create({ maxToasts: 3 });

  constructor() {
    this._web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: true,
      providerOptions: this._providerOptions,
    });

    this.initReadWeb3(Number(process.env.REACT_APP_NETWORK_ID));

    if (this._web3Modal.cachedProvider) {
      this.connect().then().catch();
    }

    this._store.subscribe(() => {
      const state = this.getState();
      console.log('state updated.', state);
    });
  }

  public static Instance() {
    if (!this._instance) {
      this._instance = new SovrynNetwork();
    }
    return this._instance;
  }

  public async connect() {
    try {
      this.connectProvider(await this._web3Modal.connect());
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async connectTo(provider: string) {
    try {
      this.connectProvider(await this._web3Modal.connectTo(provider));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async disconnect() {
    try {
      if (
        this._writeWeb3 &&
        this._writeWeb3.currentProvider &&
        (this._writeWeb3 as any).currentProvider.close
      ) {
        await (this._writeWeb3 as any).currentProvider.close();
      }
      await this._web3Modal.clearCachedProvider();
      this.store().dispatch(actions.disconnected());
      return true;
    } catch (e) {
      return false;
    }
  }

  public store() {
    return this._store;
  }

  public getState(): WalletProviderState {
    return this._store.getState().walletProvider;
  }

  public getWriteWeb3() {
    return this._writeWeb3 as Web3;
  }

  public getWeb3() {
    return this._readWeb3;
  }

  public async send(tx: TransactionConfig) {
    return new Promise<string>((resolve, reject) => {
      this._writeWeb3.eth
        .sendTransaction(tx)
        .once('transactionHash', tx => {
          resolve(tx);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  protected initWriteWeb3(provider) {
    this._writeWeb3 = new Web3(provider);

    this._writeWeb3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: (this._writeWeb3.utils as any).hexToNumber,
        },
      ],
    });
  }

  protected initReadWeb3(chainId: number) {
    this._readWeb3 = new Web3(
      new Web3.providers.WebsocketProvider(wsNodes[chainId]),
    );
  }

  protected subscribeProvider(provider) {
    if (provider.on) {
      provider.on('close', () => {
        put(actions.disconnect());
      });
      provider.on('accountsChanged', async (accounts: string[]) => {
        put(actions.accountChanged(accounts[0]));
      });
      provider.on('chainChanged', async (chainId: number) => {
        const networkId = await this._writeWeb3.eth.net.getId();
        await this.testChain(chainId);
        this.initReadWeb3(chainId);
        put(actions.chainChanged({ chainId, networkId }));
      });

      provider.on('networkChanged', async (networkId: number) => {
        const chainId = await (this._writeWeb3.eth as any).chainId();
        await this.testChain(chainId);
        this.initReadWeb3(chainId);
        put(actions.chainChanged({ chainId, networkId }));
      });
    }
  }

  protected async connectProvider(provider) {
    await this.subscribeProvider(provider);

    this.initWriteWeb3(provider);

    const accounts = await this._writeWeb3.eth.getAccounts();

    const address = accounts[0];
    const networkId = await this._writeWeb3.eth.net.getId();
    const chainId = await (this._writeWeb3.eth as any).chainId();

    this._provider = provider;

    await this.testChain(chainId);

    this.initReadWeb3(chainId);

    this.store().dispatch(
      actions.connected({
        address,
        chainId,
        networkId,
      }),
    );
  }

  protected async testChain(chainId: number) {
    if (!wsNodes.hasOwnProperty(chainId)) {
      this._toaster.show(
        {
          intent: 'danger',
          message: 'Unsupported network',
        },
        'network',
      );
      await this.disconnect();
      return Promise.reject('Unsupported network');
    }
    return Promise.resolve();
  }
}
