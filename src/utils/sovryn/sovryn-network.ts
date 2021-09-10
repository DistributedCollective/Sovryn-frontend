import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { bignumber } from 'mathjs';
import { AbiItem } from 'web3-utils';
import { store } from 'store/store';
import { currentChainId, readNodes, databaseRpcNodes } from '../classifiers';
import { appContracts } from '../blockchain/app-contracts';
import { gas } from '../blockchain/gas-price';

export class SovrynNetwork {
  private static _instance?: SovrynNetwork;
  private _store = store;

  private _writeWeb3: Web3 = null as any;
  private _readWeb3: Web3 = null as any;
  private _databaseWeb3: Web3 = null as any;
  public contracts: { [key: string]: Contract } = {};
  public contractList: Contract[] = [];
  public writeContracts: { [key: string]: Contract } = {};
  public writeContractList: Contract[] = [];
  public databaseContracts: { [key: string]: Contract } = {};
  public databaseContractList: Contract[] = [];

  constructor() {
    this.initReadWeb3(currentChainId)
      .then(async () => {
        const gasPrice = await this.getOnChainGasPrice();
        gas.set(gasPrice);
        this.refreshGasPrice();
      })
      .catch();
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
    const gasPrice = await this._readWeb3.eth.getGasPrice();
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
    return this._readWeb3;
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
    },
  ) {
    if (!this._writeWeb3) {
      return;
    }
    const contract = this.makeContract(this._writeWeb3, contractConfig);
    this.writeContracts[contractName] = contract;
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
    this.contracts[contractName] = contract;
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
        this._readWeb3.eth.handleRevert = true;

        Array.from(Object.keys(appContracts)).forEach(key => {
          this.addReadContract(key, appContracts[key]);
        });

        if (isWebsocket) {
          const provider: WebsocketProvider = (this._readWeb3
            .currentProvider as unknown) as WebsocketProvider;

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

  private refreshGasPrice() {
    setTimeout(async () => {
      try {
        const gasPrice = await this._readWeb3.eth.getGasPrice();
        gas.set(gasPrice);
        this.refreshGasPrice();
      } catch (e) {
        console.error('gas price update', e);
      }
    }, [35e3]); // updates price in 35s intervals (roughly for each block)
  }
}
