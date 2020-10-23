/* --- STATE --- */
export interface FastBtcFormState {
  step: number;
  receiverAddress: string;
  isReceiverAddressValidating: boolean;
  isReceiverAddressValid: boolean;
  depositAddress: string;
  minDepositAmount: number;
  maxDepositAmount: number;
  isDepositLoading: boolean;
  depositTx: string;
  transferTx: string;
  depositError: string;
  history: Array<any>;
}

export type ContainerState = FastBtcFormState;
