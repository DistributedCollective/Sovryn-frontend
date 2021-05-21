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
  margin-left: 1rem;
  margin-right: 1.25rem;
  position: relative;
  pointer-events: none;
`;
