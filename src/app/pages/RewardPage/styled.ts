import styled, { css } from 'styled-components';

interface IPieChartProps {
  firstPercentage: number;
  secondPercentage: number;
  thirdPercentage?: number;
}

export const PieChart = styled.div<IPieChartProps>`
  width: 9.375rem;
  height: 9.375rem;
  background: radial-gradient(
      circle closest-side,
      #222222 0,
      #222222 82%,
      transparent 82%,
      transparent 100%,
      #222222 0
    ),
    conic-gradient(
      #e9eae9 0,
      #e9eae9 ${props => props.firstPercentage}%,
      #00ce7d 0,
      #00ce7d ${props => props.firstPercentage + props.secondPercentage}%,
      ${props =>
        props.thirdPercentage
          ? css`
      #fec004 0,
      #fec004 100%
      `
          : css`
    #00ce7d 100%
    `}
    );
`;

export const ContainerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const Box = styled.div`
  background-color: #222222;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const RewardDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;
export const Divider = styled.div`
  width: 0px;
  border-width: 1px;
  height: 150px;
  border-color: #e9eae9;
`;
