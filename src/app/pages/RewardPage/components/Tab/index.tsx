import React from 'react';
import styled, { css } from 'styled-components/macro';

interface ITabProps {
  text: string;
  amount?: string;
  active?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<ITabProps> = ({
  text,
  amount,
  active,
  isDisabled,
  onClick,
}) => {
  return (
    <StyledTab
      active={active}
      isDisabled={isDisabled}
      disabled={isDisabled}
      onClick={onClick}
    >
      <div className="tw-font-extralight">{text}</div>
      <div className="tw-text-2xl tw-font-semibold">{amount}</div>
    </StyledTab>
  );
};

interface StyledProps {
  active?: boolean;
  isDisabled?: boolean;
}
const StyledTab = styled.button.attrs(_ => ({
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
  ${({ active }: StyledProps) =>
    active &&
    css`
      font-weight: 400;
      background-color: #222222;
      &:hover {
        color: var(--white);
      }
    `}
  ${({ isDisabled }: StyledProps) =>
    isDisabled &&
    css`
      background-color: grey;
    `}
`;
