export const PAGE_SIZE = 5;

export type StakeHistoryEvent = {
  id: string;
  action: StakeHistoryActionType;
  transaction: {
    id: string;
  };
  amount: string;
  lockedUntil: number;
  timestamp: number;
};

export enum StakeHistoryActionType {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  FEE_WITHDRAWN = 'FeeWithdrawn',
  INCREASE_STAKE = 'IncreaseStake',
  EXTEND_STAKE = 'ExtendStake',
  DELEGATE = 'Delegate',
  WITHDRAW_STAKED = 'WithdrawStaked',
}
