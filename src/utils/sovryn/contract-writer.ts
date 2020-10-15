import { TransactionConfig } from 'web3-core';
import { RevertInstructionError } from 'web3-core-helpers';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { actions } from '../../app/containers/WalletProvider/slice';

class ContractWriter {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  public async send(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    options: TransactionConfig = {},
  ): Promise<string | RevertInstructionError> {
    // let params = args;
    // let options = {};
    // if (args && args.length && typeof args[args.length - 1] === 'object') {
    //   params = args.slice(0, -1);
    //   options = args[args.length - 1];
    // }
    return new Promise<string | RevertInstructionError>((resolve, reject) => {
      return this.sovryn.writeContracts[contractName].methods[methodName](
        ...args,
      )
        .send(options)
        .once('transactionHash', tx => {
          this.sovryn.store().dispatch(actions.addTransaction(tx));
          resolve(tx);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}

export const contractWriter = new ContractWriter();
