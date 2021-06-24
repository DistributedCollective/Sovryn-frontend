import { Asset } from 'types';

export interface ISaleInformation {
  minAmount: string;
  maxAmount: string;
  remainingTokens: number;
  saleEnd: string;
  depositRate: number;
  participatingWallets: string;
  depositToken: Asset;
  depositType: DepositType;
  verificationType: VerificationType;
}

export enum DepositType {
  RBTC = '0',
  Token = '1',
}

export enum VerificationType {
  None = '0',
  Everyone = '1',
  ByAddress = '2',
}
