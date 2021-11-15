export interface IClaimFormProps {
  className?: string;
  amountToClaim: string;
}

export interface IRewardClaimFormProps extends IClaimFormProps {
  hasLockedSov: boolean;
  hasLMRewards: boolean;
}
