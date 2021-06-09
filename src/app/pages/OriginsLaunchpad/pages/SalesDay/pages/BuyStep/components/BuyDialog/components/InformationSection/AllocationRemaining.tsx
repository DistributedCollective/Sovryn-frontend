import React from 'react';
import { AllocationDiv, AllocationPercentage } from './styled';

interface IAllocationRemainingProps {
  saleName: string;
}

export const AllocationRemaining: React.FC<IAllocationRemainingProps> = ({
  saleName,
}) => (
  <>
    <div className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal">
      333,333 {saleName} 25%
    </div>
    <AllocationDiv>
      <AllocationPercentage />
    </AllocationDiv>
  </>
);
