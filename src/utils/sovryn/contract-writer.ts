import { TransactionConfig } from 'web3-core';
import { RevertInstructionError } from 'web3-core-helpers';
import { actions as txActions } from 'store/global/transactions-store/slice';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { contractReader } from './contract-reader';
import { bignumber } from 'mathjs';
import { TxStatus, TxType } from '../../store/global/transactions-store/types';
import { Asset } from '../../types/asset';
import { getTokenContractName } from '../blockchain/contract-helpers';
import { Nullable } from '../../types';
import { gas } from '../blockchain/gas-price';
import { transferAmount } from '../blockchain/transfer-approve-amount';

export interface CheckAndApproveResult {
  approveTx?: Nullable<string>;
  nonce?: number;
  rejected?: boolean;
}

class ContractWriter {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  public async nonce(address?: string): Promise<number> {
    return this.sovryn
      .getWriteWeb3()
      .eth.getTransactionCount(
        address || this.sovryn.store().getState().walletProvider.address,
      );
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
    const amounts = Array.isArray(amount) ? amount : [amount, amount];
    const address = this.sovryn.store().getState().walletProvider?.address;
    const dispatch = this.sovryn.store().dispatch;
    dispatch(txActions.setLoading(true));
    let nonce = await this.nonce(address);
    try {
      const allowance = await contractReader.call<string>(
        contractName,
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
          .send(
            contractName,
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
                to: contractName,
                from: address,
                value: '0',
                asset,
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
      console.error('approve error?:', e.message);
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
    if (!options.gasPrice) {
      options.gasPrice = gas.get();
    }
    return new Promise<string | RevertInstructionError>((resolve, reject) => {
      return this.sovryn.writeContracts[contractName].methods[methodName](
        ...args,
      )
        .send(options)
        .once('transactionHash', tx => resolve(tx))
        .catch(e => reject(e));
    });
  }

  public async estimateGas(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    options: TransactionConfig = {},
  ): Promise<string | RevertInstructionError> {
    if (!options.gasPrice) {
      options.gasPrice = gas.get();
    }
    return new Promise<string | RevertInstructionError>((resolve, reject) => {
      return this.sovryn.writeContracts[contractName].methods[methodName](
        ...args,
      )
        .estimateGas(options)
        .then(value => resolve(value));
    });
  }
}

export const contractWriter = new ContractWriter();
