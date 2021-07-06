import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AllocationDiv, AllocationPercentage } from './styled';

const calculateRemainingPercentage = (totalAllocation, remainingAllocation) =>
  bignumber(remainingAllocation).div(totalAllocation).mul(100).toFixed(0);

interface IAllocationRemainingProps {
  totalSaleAllocation: number;
  remainingTokens: number;
  saleName: string;
}

export const AllocationRemaining: React.FC<IAllocationRemainingProps> = ({
  totalSaleAllocation,
  remainingTokens,
  saleName,
}) => {
  const remainingAllocation = useMemo(
    () => calculateRemainingPercentage(totalSaleAllocation, remainingTokens),
    [remainingTokens, totalSaleAllocation],
  );

  const allocationPercentageWidth = useMemo(
    () => 100 - Number(remainingAllocation),
    [remainingAllocation],
  );

  return (
    <>
      <div className="tw-flex tw-justify-between">
        <span className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal">
          {weiToNumberFormat(remainingTokens)} {saleName}
        </span>
        <span className="tw-text-base tw-font-orbitron tw-font-medium tw-tracking-normal">
          {remainingAllocation}%
        </span>
      </div>
      <AllocationDiv>
        <AllocationPercentage width={allocationPercentageWidth} />
      </AllocationDiv>
    </>
  );
};
