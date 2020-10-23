import { RevertInstructionError } from 'web3-core-helpers';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';

class ContractReader {
  private sovryn: SovrynNetwork;

  constructor() {
    this.sovryn = Sovryn;
  }

  /**
   * Call contract and return response string or revert error
   * @param contractName
   * @param methodName
   * @param args
   */
  public async call(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
  ): Promise<string | RevertInstructionError> {
    return this.sovryn.contracts[contractName].methods[methodName](
      ...args,
    ).call();
  }
}

export const contractReader = new ContractReader();
