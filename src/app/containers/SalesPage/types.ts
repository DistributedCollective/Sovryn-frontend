/* --- STATE --- */
export interface SalesPageState {
  step: number;
  maxDeposit: number;
  minDeposit: number;
}

export type ContainerState = SalesPageState;
