import type { Chain } from 'types';
import { ethers } from 'ethers';
import { RpcNetwork } from '../../../../utils/blockchain/rpc-network';
import { getBridgeChainId } from './helpers';
import { BridgeNetworkDictionary } from '../dictionaries/bridge-network-dictionary';
import { NetworkModel } from '../types/network-model';
import multiCallAbi from 'utils/blockchain/abi/multiCall2.json';

interface MultiCallData {
  address: string;
  abi: ethers.ContractInterface;
  fnName: string;
  args: any[];
  key: string;
  parser?: (val: any) => any;
}

export class BridgeNetwork {
  public readonly contracts: Map<Chain, Map<string, ethers.Contract>> = new Map<
    Chain,
    Map<string, ethers.Contract>
  >();

  public async multiCall(chain: Chain, callData: MultiCallData[]) {
    const network = BridgeNetworkDictionary.get(chain) as NetworkModel;
    const data = callData.map(item => ({
      target: item.address,
      callData: this.encodeFunctionData(
        chain,
        item.address,
        item.abi,
        item.fnName,
        item.args,
      ),
    }));

    return this.call(
      chain,
      network.multicallContractAddress,
      multiCallAbi,
      'aggregate',
      [data],
    ).then(({ blockNumber, returnData }) => {
      const data = {};
      callData.forEach((item, index) => {
        const value = this.decodeFunctionResult(
          chain,
          item.address,
          item.abi,
          item.fnName,
          returnData[index],
        );
        data[item.key || index] = item.parser ? item.parser(value) : value;
      });

      return {
        blockNumber: blockNumber.toString(),
        returnData: data,
      };
    });
  }

  public async call(
    chain: Chain,
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ) {
    return this.prepareContract(chain, address, abi).callStatic[fnName](
      ...args,
    );
  }

  public async estimateGas(
    chain: Chain,
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ) {
    return this.prepareContract(chain, address, abi).estimateGas[fnName](
      ...args,
    );
  }

  public encodeFunctionData(
    chain: Chain,
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    args: any[],
  ) {
    return this.prepareContract(
      chain,
      address,
      abi,
    ).interface.encodeFunctionData(fnName, args);
  }

  public decodeFunctionResult(
    chain: Chain,
    address: string,
    abi: ethers.ContractInterface,
    fnName: string,
    data: ethers.utils.BytesLike,
  ) {
    return this.prepareContract(
      chain,
      address,
      abi,
    ).interface.decodeFunctionResult(fnName, data);
  }

  public getNode(chain: Chain) {
    return RpcNetwork.get(getBridgeChainId(chain) as any);
  }

  public getProvider(chain: Chain) {
    return this.getNode(chain).provider;
  }

  public prepareContract(
    chain: Chain,
    address: string,
    abi: ethers.ContractInterface,
  ) {
    address = address.toLowerCase();
    if (!this.contracts.has(chain)) {
      this.contracts.set(chain, new Map<string, ethers.Contract>());
    }

    const contracts = this.contracts.get(chain) as Map<string, ethers.Contract>;

    if (!contracts.has(address)) {
      const contract = new ethers.Contract(
        address,
        abi,
        this.getProvider(chain),
      );
      contracts.set(chain, contract);
      return contract;
    }

    return contracts.get(address) as ethers.Contract;
  }
}

export const bridgeNetwork = new BridgeNetwork();
