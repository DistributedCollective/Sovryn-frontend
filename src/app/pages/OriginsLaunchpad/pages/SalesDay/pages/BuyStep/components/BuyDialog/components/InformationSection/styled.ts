import styled from 'styled-components';

export const BuyInformationWrapper = styled.div`
  width: 36%;
  height: 100%;
  padding: 72px 1.5rem 72px 2.5625rem;
`;

export const AllocationDiv = styled.div`
  width: 100%;
  height: 5px;
  background-color: var(--primary);
  border-radius: 0.75rem;
`;

interface IAllocationPercentageProps {
  width: number;
}

export const AllocationPercentage = styled.div<IAllocationPercentageProps>`
  height: 100%;
  width: ${props => `${props.width}%`};
  background-color: #533f00;
  opacity: 85%;
  border-radius: 0.75rem;
`;
