import { Asset } from 'types';

export interface ISaleInformation {
  saleStart: string;
  saleEnd: string;
  depositRate: number;
  participatingWallets: string;
  depositToken: Asset;
  totalReceived: string;
  yourTotalDeposit: string;
  isClosed: boolean;
  period: string;
}

export enum DepositType {
  RBTC = '0',
  Token = '1',
}
