import styled from 'styled-components';

interface IStyledCardRowProps {
  leftColor?: string;
}

export const StyledCardRow = styled.div<IStyledCardRowProps>`
  background: #222222 0% 0% no-repeat padding-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  padding-right: 10px;
  border-left-width: 10px;
  border-left-color: ${props => `${props.leftColor || '#414042'}`};
`;
