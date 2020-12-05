import Web3 from 'web3';
import { TransactionConfig, WebsocketProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { Toaster } from '@blueprintjs/core/lib/esm/components/toast/toaster';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Portis from '@portis/web3';
import { store } from 'store/store';
import {
  currentChainId,
  rpcNodes,
  readNodes,
  currentNetwork,
  databaseRpcNodes,
} from '../classifiers';
import { actions } from '../../app/containers/WalletProvider/slice';
import { WalletProviderState } from '../../app/containers/WalletProvider/types';
import Web3Modal, { IProviderOptions, ThemeColors } from 'web3modal';
import { AbiItem } from 'web3-utils';
import { appContracts } from '../blockchain/app-contracts';

const themeColors: ThemeColors = {
  background: 'var(--primary)',
  border: 'none',
  main: 'var(--white)',
  secondary: 'var(--white)',
  hover: 'var(--secondary)',
};

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
        chainId: currentChainId,
        rpc: rpcNodes,
      },
    },
    portis: {
      package: Portis, // required
      options: {
        dappId: process.env.REACT_APP_PORTIS_ID,
        network: currentNetwork === 'mainnet' ? 'orchid' : 'orchidTestnet',
        id: process.env.REACT_APP_PORTIS_ID,
      },
    },
  };
  private _provider = null;
  private _writeWeb3: Web3 = null as any;
  private _readWeb3: Web3 = null as any;
  private _databaseWeb3: Web3 = null as any;
  private _toaster = Toaster.create({ maxToasts: 3 });
  public contracts: { [key: string]: Contract } = {};
  public contractList: Contract[] = [];
  public writeContracts: { [key: string]: Contract } = {};
  public writeContractList: Contract[] = [];
  public databaseContracts: { [key: string]: Contract } = {};
  public databaseContractList: Contract[] = [];

  constructor() {
    this._web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: true,
      providerOptions: this._providerOptions,
      theme: themeColors,
    });

    this.initReadWeb3(currentChainId).then().catch();

    if (this._web3Modal.cachedProvider) {
      this.connect().then().catch();
    }

    // this._store.subscribe(() => {
    //   const state = this.getState();
    // });
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
      console.error('connect fails.');
      console.error(e);
      return false;
    }
  }

  public async connectTo(provider: string) {
    try {
      this.connectProvider(await this._web3Modal.connectTo(provider));
      return true;
    } catch (e) {
      console.error('connectTo fails.');
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
          this.store().dispatch(actions.addTransaction(tx));
          resolve(tx);
        })
        .catch(e => {
          console.log('rejecting.');
          reject(e);
        });
    });
  }

  public async callContract(contractName: string, methodName, ...args) {
    let params = args;
    let options = {};
    if (args && args.length && typeof args[args.length - 1] === 'object') {
      params = args.slice(0, -1);
      options = args[args.length - 1];
    }
    return new Promise<string>((resolve, reject) => {
      return this.writeContracts[contractName].methods[methodName](...params)
        .send(options)
        .once('transactionHash', tx => {
          this.store().dispatch(actions.addTransaction(tx));
          resolve(tx);
        })
        .catch(e => {
          console.log('rejecting');
          reject(e);
        });
    });
  }

  public addWriteContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
    },
  ) {
    if (!this._writeWeb3) {
      return;
    }
    const contract = this.makeContract(this._writeWeb3, contractConfig);
    // @ts-ignore
    this.writeContracts[contractName] = contract;
    // @ts-ignore
    this.writeContractList.push(contract);
  }

  public addReadContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
    },
  ) {
    if (!this._readWeb3) {
      return;
    }
    const contract = this.makeContract(this._readWeb3, contractConfig);
    // @ts-ignore
    this.contracts[contractName] = contract;
    // @ts-ignore
    this.contractList.push(contract);
  }

  public addDatabaseContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
    },
  ) {
    if (!this._databaseWeb3) {
      return;
    }
    const contract = this.makeContract(this._databaseWeb3, contractConfig);
    // @ts-ignore
    this.databaseContracts[contractName] = contract;
    // @ts-ignore
    this.databaseContractList.push(contract);
  }

  protected makeContract(
    web3: Web3,
    contractConfig: { address: string; abi: AbiItem | AbiItem[] },
  ) {
    return new web3.eth.Contract(contractConfig.abi, contractConfig.address, {
      // from: address,
      // data: deployedBytecode,
    });
  }

  protected initWriteWeb3(provider) {
    try {
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

      Array.from(Object.keys(appContracts)).forEach(key => {
        this.addWriteContract(key, appContracts[key]);
      });
    } catch (e) {
      console.error('init write web3 fails');
      console.error(e);
    }
  }

  protected async initReadWeb3(chainId: number) {
    try {
      if (
        !this._readWeb3 ||
        (this._readWeb3 && (await this._readWeb3.eth.getChainId()) !== chainId)
      ) {
        const nodeUrl = readNodes[chainId];
        let web3Provider;
        let isWebsocket = false;
        if (nodeUrl.startsWith('http')) {
          web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
            keepAlive: true,
          });
        } else {
          web3Provider = new Web3.providers.WebsocketProvider(nodeUrl, {
            reconnectDelay: 10,
          });
          isWebsocket = true;
        }

        this._readWeb3 = new Web3(web3Provider);

        Array.from(Object.keys(appContracts)).forEach(key => {
          this.addReadContract(key, appContracts[key]);
        });

        if (isWebsocket) {
          const provider: WebsocketProvider = this._readWeb3
            .currentProvider as WebsocketProvider;

          provider.on('end', () => {
            provider.removeAllListeners('end');
            this.contracts = {};
            this.contractList = [];
            this._readWeb3 = undefined as any;
            this.initReadWeb3(chainId);
          });
        }
      }
      this.initDatabaseWeb3(chainId);
    } catch (e) {
      console.error('init read web3 fails.');
      console.error(e);
    }
  }

  protected async initDatabaseWeb3(chainId: number) {
    try {
      const nodeUrl = databaseRpcNodes[chainId];
      const web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
        keepAlive: true,
      });
      this._databaseWeb3 = new Web3(web3Provider);
      Array.from(Object.keys(appContracts)).forEach(key => {
        this.addDatabaseContract(key, appContracts[key]);
      });
    } catch (e) {
      console.error('init database web3 fails.');
      console.error(e);
    }
  }

  protected subscribeProvider(provider) {
    try {
      if (provider.on) {
        provider.on('close', () => {
          this.store().dispatch(actions.disconnect());
        });
        provider.on('error', error => {
          console.error('provider error', error);
        });
        provider.on('open', a => {
          console.log('provider open?', a);
        });
        provider.on('accountsChanged', async (accounts: string[]) => {
          this.store().dispatch(actions.accountChanged(accounts[0]));
        });
        provider.on('chainChanged', async (chainId: number) => {
          const networkId = await this._writeWeb3.eth.net.getId();
          await this.testChain(chainId);
          await this.initReadWeb3(chainId);
          this.store().dispatch(actions.chainChanged({ chainId, networkId }));
        });

        provider.on('networkChanged', async (networkId: number) => {
          const chainId = await (this._writeWeb3.eth as any).chainId();
          await this.testChain(chainId);
          await this.initReadWeb3(chainId);
          this.store().dispatch(actions.chainChanged({ chainId, networkId }));
        });
      }
    } catch (e) {
      console.error('subscribe provider fails');
      console.error(e);
    }
  }

  protected async connectProvider(provider) {
    try {
      this.store().dispatch(actions.connect());
      await this.subscribeProvider(provider);

      this.initWriteWeb3(provider);

      const accounts = await this._writeWeb3.eth.getAccounts();

      const address = accounts[0];
      const networkId = await this._writeWeb3.eth.net.getId();
      const chainId = await (this._writeWeb3.eth as any).chainId();

      this._provider = provider;

      await this.testChain(chainId);

      await this.initReadWeb3(chainId);

      this.store().dispatch(actions.chainChanged({ chainId, networkId }));
      this.store().dispatch(actions.connected({ address }));
    } catch (e) {
      console.error('connect provider fails.');
      console.error(e);
    }
  }

  protected async testChain(chainId: number) {
    if (chainId !== currentChainId) {
      this._toaster.show(
        {
          intent: 'danger',
          message: `Please switch to RSK ${currentNetwork}.`,
        },
        'network',
      );
      await this.disconnect();
      return Promise.reject('Unsupported network');
    }

    // localStorage.setItem('connectedToRskBefore', 'true');
    return Promise.resolve();
  }
}
