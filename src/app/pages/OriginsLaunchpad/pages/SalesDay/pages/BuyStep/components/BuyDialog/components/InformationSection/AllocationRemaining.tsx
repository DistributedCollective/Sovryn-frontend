import React from 'react';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AllocationDiv, AllocationPercentage } from './styled';

interface IAllocationRemainingProps {
  remainingTokens: number;
  saleName: string;
}

export const AllocationRemaining: React.FC<IAllocationRemainingProps> = ({
  remainingTokens,
  saleName,
}) => (
  <>
    <div className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal">
      {weiToNumberFormat(remainingTokens)} {saleName} 25%
    </div>
    <AllocationDiv>
      <AllocationPercentage />
    </AllocationDiv>
  </>
);
