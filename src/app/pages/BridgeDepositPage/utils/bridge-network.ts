import type { Chain } from 'types';
import { ethers } from 'ethers';
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { walletService } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';
import { RpcNetwork } from '../../../../utils/blockchain/rpc-network';
import { getBridgeChainId } from './helpers';
import { BridgeNetworkDictionary } from '../dictionaries/bridge-network-dictionary';
import { NetworkModel } from '../types/network-model';
import { AssetModel } from '../types/asset-model';

import multiCallAbi from 'utils/blockchain/abi/multiCall2.json';
import erc20Abi from 'utils/blockchain/abi/erc20.json';
import mAssetAbi from 'utils/blockchain/abi/BabelFish_MassetAbi.json';
import bridgeAbi from 'utils/blockchain/abi/BridgeAbi.json';
import { CrossBridgeAsset } from '../types/cross-bridge-asset';

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

  public async nonce(chain: Chain) {
    return this.getNode(chain).getTransactionCount(
      walletService.address.toLowerCase(),
    );
  }

  public async receipt(chain: Chain, transactionHash: string) {
    return this.getNode(chain)
      .getTransactionReceipt(transactionHash)
      .catch(e => console.error(e, transactionHash, chain));
  }

  public async allowance(chain: Chain, asset: AssetModel, spender: string) {
    return this.call(chain, asset.tokenContractAddress, erc20Abi, 'allowance', [
      walletService.address.toLowerCase(),
      spender.toLowerCase(),
    ]).then(e => e.toString());
  }

  public approveData(
    chain: Chain,
    asset: AssetModel,
    spender: string,
    amount: string,
  ) {
    return this.encodeFunctionData(
      chain,
      asset.tokenContractAddress,
      erc20Abi,
      'approve',
      [spender.toLowerCase(), amount],
    );
  }

  public redeemToBridgeData(
    chain: Chain,
    contractAddress: string,
    bAsset: string,
    mAssetAmount: string,
    recipient: string,
  ) {
    return this.encodeFunctionData(
      chain,
      contractAddress,
      mAssetAbi,
      'redeemToBridge',
      [bAsset, mAssetAmount, recipient],
    );
  }

  public receiveEthAtData(
    chain: Chain,
    bridgeContractAddress: string,
    receiver: string,
    data: string = '0x',
  ) {
    return this.encodeFunctionData(
      chain,
      bridgeContractAddress,
      bridgeAbi,
      'receiveEthAt',
      [receiver, data],
    );
  }

  public receiveTokensAtData(
    chain: Chain,
    bridgeContractAddress: string,
    tokenAddress: string,
    amount: string,
    receiver: string,
    data: string = '0x',
  ) {
    return this.encodeFunctionData(
      chain,
      bridgeContractAddress,
      bridgeAbi,
      'receiveTokensAt',
      [tokenAddress, amount, receiver, data],
    );
  }

  public balanceOfBridgeToken(
    chain: Chain,
    targetChain: Chain,
    asset: AssetModel,
    targetAsset: CrossBridgeAsset,
  ) {
    const tokenAddress =
      asset.bridgeTokenAddresses.get(targetAsset) || asset.tokenContractAddress;
    return this.encodeFunctionData(chain, tokenAddress, erc20Abi, 'balanceOf', [
      asset.aggregatorContractAddress,
    ]);
  }

  public async multiCall<T = any>(chain: Chain, callData: MultiCallData[]) {
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
      const data: T = {} as any;
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
    return this.prepareContract(chain, address, abi)
      .callStatic[fnName](...args)
      .catch(error => {
        console.error(chain, address, fnName, args);
        throw error;
      });
  }

  public async send(chain: Chain, tx: TransactionRequest) {
    tx.from = walletService.address.toLowerCase();

    if (tx.nonce === undefined) {
      tx.nonce = await this.nonce(chain);
    }

    if (tx.gasLimit === undefined) {
      tx.gasLimit = await this.getNode(chain).estimateGas(tx);
    }

    if (tx.gasPrice === undefined) {
      tx.gasPrice = await this.getNode(chain).getGasPrice();
    }

    const signedTxOrTransactionHash = await walletService.signTransaction({
      to: tx.to?.toLowerCase(),
      value: String(tx?.value || '0'),
      data: tx.data?.toString(),
      gasPrice: tx.gasPrice.toString(),
      nonce: Number(tx.nonce),
      gasLimit: tx.gasLimit.toString(),
      chainId: walletService.chainId,
    });

    if (isWeb3Wallet(walletService.providerType as ProviderType)) {
      return signedTxOrTransactionHash;
    } else {
      return await this.getProvider(chain)
        .sendTransaction(signedTxOrTransactionHash)
        .then(response => response.hash);
    }
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
