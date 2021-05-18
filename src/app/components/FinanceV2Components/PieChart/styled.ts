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
  background-image: ${props =>
    `conic-gradient(${props.firstColor} ${props.firstPercentage}deg, ${props.secondColor} ${props.firstPercentage}deg ${props.secondPercentage}deg)`};
  z-index: 2;
`;
