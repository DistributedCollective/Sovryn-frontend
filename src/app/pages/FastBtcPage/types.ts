import { Chain } from 'types';

export enum FastBtcDirectionType {
  DEPOSIT = 'deposit',
  TRANSAK = 'transak',
  WITHDRAW = 'withdraw',
}

export type NetworkAwareComponentProps = {
  network: Chain;
};
