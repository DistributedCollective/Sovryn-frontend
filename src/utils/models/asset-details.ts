import { Asset } from '../../types/asset';
import { AbiItem } from 'web3-utils';
import { ContractName } from '../types/contracts';
import { appContracts } from '../blockchain/app-contracts';

interface ContractInterface {
  address: string;
  abi: AbiItem | AbiItem[] | any;
}

export class AssetDetails {
  public tokenContract: ContractInterface;
  public lendingContract: ContractInterface;
  public ammContract: ContractInterface;
  constructor(
    public asset: Asset,
    public primaryCollateralAsset: Asset,
    public symbol: string,
    public name: string,
    public decimals: number,
    public logoSvg: string,
  ) {
    this.tokenContract = appContracts[this.getTokenContractName()];
    this.lendingContract = appContracts[this.getLendingContractName()];
    if (appContracts.hasOwnProperty(this.getAmmContractName())) {
      this.ammContract = appContracts[this.getAmmContractName()];
    } else {
      this.ammContract = null as any;
    }
  }

  public getTokenContractName(): ContractName {
    return (this.asset + '_token') as ContractName;
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
}
