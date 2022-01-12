import { Chain } from 'types';

export enum FastBtcDirectionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type NetworkAwareComponentProps = {
  network: Chain;
};
