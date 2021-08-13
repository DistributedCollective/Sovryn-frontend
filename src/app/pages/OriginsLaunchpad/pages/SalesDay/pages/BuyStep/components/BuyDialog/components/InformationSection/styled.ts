import styled from 'styled-components';

export const BuyInformationWrapper = styled.div`
  width: 36%;
  height: 100%;
  padding: 4.8125rem 1.5rem 4.1875rem 2.5625rem;
`;

export const AllocationDiv = styled.div`
  width: 100%;
  height: 5px;
  background-color: theme('colors.primary');
  border-radius: 10px;
`;

interface IAllocationPercentageProps {
  width: number;
}

export const AllocationPercentage = styled.div<IAllocationPercentageProps>`
  height: 100%;
  width: ${props => `${props.width}%`};
  background-color: #533f00;
  opacity: 85%;
  border-radius: 10px;
`;
