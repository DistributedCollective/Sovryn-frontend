import styled, { css } from 'styled-components';

interface IStyledTabProps {
  active?: boolean;
  isDisabled?: boolean;
}

export const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  className: 'btn',
}))`
  color: var(--light-gray);
  padding: 5px 10px;
  background-color: rgba(34, 34, 34, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  &:hover {
    color: var(--LightGrey);
  }
  ${({ active }: IStyledTabProps) =>
    active &&
    css`
      font-weight: 400;
      background-color: #222222;
      &:hover {
        color: var(--white);
      }
    `}
  ${({ isDisabled }: IStyledTabProps) =>
    isDisabled &&
    css`
      background-color: grey;
      cursor: not-allowed;
    `}
`;
