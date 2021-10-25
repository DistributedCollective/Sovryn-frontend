import { Asset } from 'types';

export interface ISaleInformation {
  minAmount: string;
  maxAmount: string;
  remainingTokens: number;
  saleStart: string;
  saleEnd: string;
  depositRate: number;
  participatingWallets: string;
  depositToken: Asset;
  depositType: DepositType;
  verificationType: VerificationType;
  totalSaleAllocation: number;

  totalReceived: string;
  yourTotalDeposit: string;
  isClosed: boolean;
  period: string;
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
