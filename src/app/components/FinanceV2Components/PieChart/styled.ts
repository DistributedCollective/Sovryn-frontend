import styled from 'styled-components';

interface IStyledPieChartProps {
  firstColor: string;
  secondColor?: string;
  firstPercentage: number;
  secondPercentage?: number;
}

export const StyledPieChart = styled.div<IStyledPieChartProps>`
  display: block;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-image: ${({
    firstColor,
    firstPercentage,
    secondColor,
    secondPercentage,
  }) =>
    `conic-gradient(${firstColor} ${firstPercentage}deg, ${secondColor} ${firstPercentage}deg ${secondPercentage}deg)`};
  z-index: 2;
`;
