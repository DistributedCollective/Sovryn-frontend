import styled, { css } from 'styled-components';

interface IStyledArrowProps {
  isLeft?: boolean;
}

export const StyledArrow = styled.div<IStyledArrowProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  ${props =>
    props.isLeft
      ? css`
          left: 1rem;
        `
      : css`
          right: 1rem;
        `}
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  top: 37%;
`;

export const Dot = styled.li`
  width: 10px;
  height: 10px;
  border: 1px solid #e9eae9;
  border-radius: 50%;
  margin-right: 1rem;
`;
