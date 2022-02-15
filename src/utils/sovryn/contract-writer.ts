import { TransactionConfig } from 'web3-core';
import { RevertInstructionError } from 'web3-core-helpers';
import Web3Contract, { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { walletService } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';
import { actions as txActions } from 'store/global/transactions-store/slice';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { contractReader } from './contract-reader';
import { bignumber } from 'mathjs';
import { TxStatus, TxType } from '../../store/global/transactions-store/types';
import { Asset } from '../../types';
import {
  getContract,
  getContractNameByAddress,
  getTokenContractName,
} from '../blockchain/contract-helpers';
import { Nullable } from '../../types';
import { gas } from '../blockchain/gas-price';
import { transferAmount } from '../blockchain/transfer-approve-amount';
import { currentChainId, MIN_GAS } from 'utils/classifiers';

import erc20Abi from 'utils/blockchain/abi/erc20.json';

export interface CheckAndApproveResult {
  approveTx?: Nullable<string>;
  nonce?: number;
  rejected?: boolean;
}

class ContractWriter {
  private sovryn: SovrynNetwork;
  private contracts: { [address: string]: Contract } = {};

  constructor() {
    this.sovryn = Sovryn;
  }

  public async checkAndApprove(
    asset: Asset,
    spenderAddress: string,
    amount: string | string[],
  ): Promise<CheckAndApproveResult> {
    return this.checkAndApproveContract(
      getTokenContractName(asset),
      spenderAddress,
      amount,
      asset,
    );
  }

  public async checkAndApproveContract(
    contractName: ContractName,
    spenderAddress: string,
    amount: string | string[],
    asset: Asset,
  ): Promise<CheckAndApproveResult> {
    return this.checkAndApproveAddresses(
      getContract(contractName).address,
      spenderAddress,
      amount,
      asset,
    );
  }

  public async checkAndApproveAddresses(
    token: string,
    spenderAddress: string,
    amount: string | string[],
    asset?: Asset | string,
  ) {
    const amounts = Array.isArray(amount) ? amount : [amount, amount];
    const address = walletService.address.toLowerCase();
    const dispatch = this.sovryn.store().dispatch;
    dispatch(txActions.setLoading(true));
    let nonce = await contractReader.nonce(address);
    try {
      const allowance = await contractReader.callByAddress<string>(
        token,
        erc20Abi as AbiItem[],
        'allowance',
        [address, spenderAddress],
      );
      let approveTx: any = null;
      if (bignumber(allowance).lessThan(amounts[0])) {
        dispatch(
          txActions.openTransactionRequestDialog({
            type: TxType.APPROVE,
            asset,
            amount: transferAmount.get(amounts[0]),
          }),
        );
        approveTx = await contractWriter
          .sendByAddress(
            token,
            erc20Abi,
            'approve',
            [spenderAddress, transferAmount.get(amounts[1])],
            {
              nonce,
              from: address,
            },
          )
          .then(tx => {
            this.sovryn.store().dispatch(
              txActions.addTransaction({
                transactionHash: tx as string,
                approveTransactionHash: null,
                type: TxType.APPROVE,
                status: TxStatus.PENDING,
                loading: false,
                to: getContractNameByAddress(token) || token,
                from: address,
                value: '0',
                asset: asset || null,
                assetAmount: transferAmount.get(amounts[1]),
              }),
            );
            return tx;
          });
        nonce += 1;
      }
      dispatch(txActions.setLoading(false));
      dispatch(txActions.closeTransactionRequestDialog());
      return {
        approveTx,
        nonce,
        rejected: false,
      };
    } catch (e) {
      dispatch(txActions.setLoading(false));
      dispatch(txActions.setTransactionRequestDialogError(e.message));
      return {
        approveTx: null,
        nonce,
        rejected: true,
      };
    }
  }

  public async send(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    options: TransactionConfig = {},
  ): Promise<string | RevertInstructionError> {
    if (contractName.endsWith('_poolToken')) {
      const c = Sovryn.contracts[contractName];
      return this.sendByAddress(
        c.options.address,
        c.options.jsonInterface,
        methodName,
        args,
        options,
      );
    } else {
      const { address, abi } = getContract(contractName);

      return this.sendByAddress(address, abi, methodName, args, options);
    }
  }

  public async sendByAddress(
    address: string,
    abi: AbiItem[] | AbiItem | any,
    methodName: string,
    args: any[],
    options: TransactionConfig = {},
  ): Promise<string | RevertInstructionError> {
    return new Promise<string | RevertInstructionError>(
      async (resolve, reject) => {
        const data = this.getCustomContract(address, abi)
          .methods[methodName](...args)
          .encodeABI();

        const nonce =
          options.nonce ||
          (await contractReader.nonce(walletService.address.toLowerCase()));

        let gasLimit =
          options?.gas ||
          (await this.estimateCustomGas(address, abi, methodName, args, {
            value: options?.value,
            gasPrice: options?.gasPrice,
            nonce,
          }));

        if (bignumber(gasLimit).lessThan(MIN_GAS)) {
          gasLimit = MIN_GAS;
        }

        try {
          const signedTxOrTransactionHash = await walletService.signTransaction(
            {
              to: address.toLowerCase(),
              value: String(options?.value || '0'),
              data: data,
              gasPrice: gas.get(),
              nonce,
              gasLimit: String(gasLimit),
              chainId: options?.chainId || currentChainId,
            },
          );

          // Browser wallets (extensions) signs and broadcasts transactions themselves
          if (isWeb3Wallet(walletService.providerType as ProviderType)) {
            resolve(signedTxOrTransactionHash);
          } else {
            // Broadcast signed transaction and retrieve txHash.
            return this.sovryn
              .getWeb3()
              .eth.sendSignedTransaction(signedTxOrTransactionHash)
              .once('transactionHash', tx => resolve(tx))
              .catch(e => reject(e));
          }
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  public async estimateGas(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    options: TransactionConfig = {},
  ) {
    const { address, abi } = getContract(contractName);
    return this.estimateCustomGas(address, abi, methodName, args, options);
  }

  public async estimateCustomGas(
    address: string,
    abi: AbiItem[],
    methodName: string,
    args: Array<any>,
    options: TransactionConfig = {},
  ) {
    if (!options.gasPrice) {
      options.gasPrice = gas.get();
    }
    if (!options.to) {
      options.to = address.toLowerCase();
    }
    if (!options.from) {
      options.from = walletService.address.toLowerCase();
    }
    options.data = this.getCustomContract(address, abi)
      .methods[methodName](...args)
      .encodeABI();
    return new Promise<number>(resolve => {
      return Sovryn.getWeb3()
        .eth.estimateGas(options)
        .then(value => resolve(value));
    });
  }

  public getContract(contractName: ContractName) {
    if (contractName.endsWith('__poolToken')) {
      return Sovryn.contracts[contractName];
    } else {
      const { address, abi } = getContract(contractName);
      return this.getCustomContract(address, abi);
    }
  }

  public getCustomContract(address: string, abi: AbiItem[]) {
    address = address.toLowerCase();
    if (!this.contracts.hasOwnProperty(address)) {
      // had to be done, library has invalid typings.
      this.contracts[address] = new (Web3Contract as any)(abi, address);
    }
    return this.contracts[address];
  }
}

export const contractWriter = new ContractWriter();
