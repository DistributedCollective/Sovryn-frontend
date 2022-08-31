import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { bignumber } from 'mathjs';
import { AbiItem } from 'web3-utils';
import { store } from 'store/store';
import { currentChainId, rpcNodes, databaseRpcNodes } from '../classifiers';
import { appContracts } from '../blockchain/app-contracts';
import { gas } from '../blockchain/gas-price';
import { actions } from '../../app/containers/WalletProvider/slice';

export class SovrynNetwork {
  private static _instance?: SovrynNetwork;
  private _store = store;
  private _retryCount = 0;

  private _writeWeb3: Web3 = null as any;
  private _readWeb3: Record<number, Web3> = {};
  private _databaseWeb3: Record<number, Web3> = {};
  private _connected = false;

  public contracts: { [key: string]: Contract } = {};
  public contractList: Contract[] = [];
  public writeContracts: { [key: string]: Contract } = {};
  public writeContractList: Contract[] = [];
  public databaseContracts: { [key: string]: Contract } = {};
  public databaseContractList: Contract[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this._connected = false;

    this.initReadWeb3(currentChainId)
      .then(async () => {
        const gasPrice = await this.getOnChainGasPrice();
        gas.set(gasPrice);
        this.refreshGasPrice();

        this._connected = true;
        this._store.dispatch(actions.sovrynNetworkReady());
      })
      .catch(error => {
        console.error(error);
        setTimeout(() => this.init(), 5000);
        this._store.dispatch(actions.sovrynNetworkError);
      });
  }

  public static Instance() {
    if (!this._instance) {
      this._instance = new SovrynNetwork();
    }
    return this._instance;
  }

  public store() {
    return this._store;
  }

  public async getOnChainGasPrice() {
    const gasPrice = await this._readWeb3[currentChainId].eth.getGasPrice();
    // add 1% to retrieved gas to confirm transactions faster.
    return bignumber(gasPrice).mul(1.01).toFixed(0);
  }

  /**
   * @deprecated
   */
  public getWriteWeb3() {
    return this._writeWeb3 as Web3;
  }

  /**
   * TODO: deprecate this
   */
  public getWeb3() {
    return this._readWeb3[currentChainId];
  }

  /**
   * @deprecated
   * @param contractName
   * @param contractConfig
   */
  public addWriteContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
      chainId?: number;
    },
  ) {
    const chainId = contractConfig.chainId || currentChainId;
    if (!this._writeWeb3[chainId]) {
      return;
    }
    const contract = this.makeContract(
      this._writeWeb3[chainId],
      contractConfig,
    );
    this.writeContracts[contractName] = contract;
    this.writeContractList.push(contract);
  }

  public addReadContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
      chainId?: number;
    },
  ) {
    const chainId = contractConfig.chainId || currentChainId;
    if (!this._readWeb3[chainId]) {
      const nodeUrl = this.getNodeUrl(chainId);
      const web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
        keepAlive: true,
      });

      this._readWeb3[chainId] = new Web3(web3Provider);
      this._readWeb3[chainId].eth.handleRevert = true;
    }
    const contract = this.makeContract(this._readWeb3[chainId], contractConfig);
    this.contracts[contractName] = contract;
    this.contractList.push(contract);
  }

  public addDatabaseContract(
    contractName: string,
    contractConfig: {
      address: string;
      abi: AbiItem | AbiItem[];
      chainId?: number;
    },
  ) {
    const chainId = contractConfig.chainId || currentChainId;

    if (!this._databaseWeb3[chainId]) {
      const nodeUrl = databaseRpcNodes[chainId];
      const web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
        keepAlive: true,
      });
      this._databaseWeb3[chainId] = new Web3(web3Provider);
    }

    const contract = this.makeContract(
      this._databaseWeb3[chainId],
      contractConfig,
    );
    this.databaseContracts[contractName] = contract;
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

  /**
   * @deprecated
   * @param provider
   */
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

      Object.keys(appContracts).forEach(key => {
        if (appContracts[key].chainId === currentChainId) {
          this.addWriteContract(key, appContracts[key]);
        }
      });
    } catch (e) {
      console.error('init write web3 fails');
      console.error(e);
    }
  }

  protected async initReadWeb3(chainId: number) {
    try {
      const nodeUrl = this.getNodeUrl(chainId);
      const web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
        keepAlive: true,
      });

      if (!this._readWeb3[chainId]) {
        this._readWeb3[chainId] = new Web3(web3Provider);
        this._readWeb3[chainId].eth.handleRevert = true;
        // if (isWebsocket) {
        //   const provider: WebsocketProvider = (this._readWeb3
        //     .currentProvider as unknown) as WebsocketProvider;

        //   provider.on('end', () => {
        //     provider.removeAllListeners('end');
        //     this.contracts = {};
        //     this.contractList = [];
        //     this._readWeb3 = undefined as any;
        //     this.initReadWeb3(chainId);
        //   });
        // }
      } else {
        this._readWeb3[chainId].setProvider(web3Provider);

        this.contracts = {};
        this.contractList = [];
      }

      Array.from(Object.keys(appContracts)).forEach(key => {
        this.addReadContract(key, appContracts[key]);
      });

      await this.initDatabaseWeb3(chainId);
    } catch (error) {
      console.error('init read web3 failed.');
      throw error;
    }
  }

  protected async initDatabaseWeb3(chainId: number) {
    try {
      Object.keys(appContracts).forEach(key => {
        this.addDatabaseContract(key, appContracts[key]);
      });
    } catch (e) {
      console.error('init database web3 fails.');
      console.error(e);
    }
  }

  private async refreshGasPrice() {
    try {
      const gasPrice = Number(
        await this._readWeb3[currentChainId].eth.getGasPrice(),
      );
      const lastBlock = Number(
        ((await this._readWeb3[currentChainId].eth.getBlock('latest')) as any)
          .minimumGasPrice,
      );
      gas.set(
        ((gasPrice > lastBlock ? gasPrice : lastBlock) * 1.01).toFixed(0),
      );
      setTimeout(() => {
        this.refreshGasPrice();
      }, [35e3]); // updates price in 35s intervals (roughly for each block)
    } catch (e) {
      console.error('gas price update failed.', e);
      this._store.dispatch(actions.sovrynNetworkError());
      await this.init(); // Connection aborted, try to reconnect
    }
  }

  private getNodeUrl(chainId: number) {
    const retry = this._retryCount++;
    return rpcNodes[chainId]?.[retry % rpcNodes[chainId].length];
  }
}
