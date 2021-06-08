import React from 'react';
import { AllocationDiv, AllocationPercentage } from './styled';

export const AllocationRemaining: React.FC = () => (
  <>
    <div className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal">
      333,333 FISH 25%
    </div>
    <AllocationDiv>
      <AllocationPercentage />
    </AllocationDiv>
  </>
);
