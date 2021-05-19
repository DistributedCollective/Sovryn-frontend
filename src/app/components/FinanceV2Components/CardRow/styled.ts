import styled from 'styled-components';

interface IStyledCardRowProps {
  leftColor?: string;
}

export const StyledCardRow = styled.div<IStyledCardRowProps>`
  background-color: #222222;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding-right: 10px;
  border-left-width: 10px;
  border-left-color: ${props => `${props.leftColor || '#222222'}`};
`;

export const ChartWrapper = styled.div`
  max-width: 27.5rem;
  margin-left: 1rem;
  margin-right: 1.75rem;
`;
