import { ethers } from 'ethers';
import type {
  BlockTag,
  TransactionRequest,
} from '@ethersproject/abstract-provider';

export class RpcNode {
  public readonly provider: ethers.providers.JsonRpcProvider;
  constructor(rpc: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
  }

  public async getTransaction(transactionHash: string) {
    return this.provider.getTransaction(transactionHash);
  }

  public async getTransactionReceipt(transactionHash: string) {
    return this.provider.getTransactionReceipt(transactionHash);
  }

  public async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ) {
    return this.provider.getTransactionCount(addressOrName, blockTag);
  }

  public async getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  public async getBlock(
    blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>,
  ) {
    return this.provider.getBlock(blockHashOrBlockTag);
  }

  public async getBalance(address: string) {
    return this.provider.getBalance(address);
  }

  public async estimateGas(transaction: TransactionRequest) {
    return this.provider
      .estimateGas(transaction as any)
      .then(result => result.toString());
  }

  public async getGasPrice() {
    return this.provider.getGasPrice().then(e => e.toString());
  }

  public async call(transaction: TransactionRequest) {
    return this.provider.call(transaction as any);
  }

  public async sendSignedTransaction(
    signedTransaction: string | Promise<string>,
  ) {
    return this.provider.sendTransaction(signedTransaction);
  }
}
