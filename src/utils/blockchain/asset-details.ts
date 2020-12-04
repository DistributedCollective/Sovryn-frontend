import { Asset } from '../../types/asset';
import { AbiItem } from 'web3-utils';
import { ContractName } from '../types/contracts';
import { appContracts } from './app-contracts';

interface ContractInterface {
  address: string;
  abi: AbiItem | AbiItem[] | any;
}

export class AssetDetails {
  public tokenContract: ContractInterface;
  public tokenPoolContract: ContractInterface;
  public lendingContract: ContractInterface;
  constructor(
    public asset: Asset,
    public primaryCollateralAsset: Asset,
    public symbol: string,
    public name: string,
    public decimals: number,
    public logoSvg: string,
  ) {
    this.tokenContract = appContracts[this.getTokenContractName()];
    this.tokenPoolContract = appContracts[this.getPoolTokenContractName()];
    this.lendingContract = appContracts[this.getLendingContractName()];
  }

  public getTokenContractName(): ContractName {
    return (this.asset + '_token') as ContractName;
  }

  public getPoolTokenContractName(): ContractName {
    return (this.asset + '_poolToken') as ContractName;
  }

  public getLendingContractName(): ContractName {
    return (this.asset + '_lending') as ContractName;
  }

  public getAmmContractName(): ContractName {
    return (this.asset + '_amm') as ContractName;
  }

  public getTokenContractAddress(): string {
    return this.tokenContract.address;
  }

  public getLendingContractAddress(): string {
    return this.lendingContract.address;
  }
}
