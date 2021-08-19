import React from 'react';
import styled, { css } from 'styled-components/macro';

interface ITabProps {
  text: string;
  amount: string;
  active: boolean;
  onClick: () => void;
}

export const Tab: React.FC<ITabProps> = ({ text, amount, active, onClick }) => {
  return (
    <StyledTab active={active} onClick={onClick}>
      <div>{text}</div>
      <div className="tw-text-2xl tw-font-semibold">{amount}</div>
    </StyledTab>
  );
};

interface StyledProps {
  active: boolean;
}
const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  className: 'btn',
}))`
  color: var(--light-gray);
  padding: 5px 10px;
  background: transparent;
  font-size: 18px;
  font-weight: 100;
  font-family: Montserrat;
  text-transform: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  background-color: rgba(34, 34, 34, 0.5);
  &:hover {
    color: var(--LightGrey);
  }
  ${(props: StyledProps) =>
    props.active &&
    css`
      font-weight: 400;
      background-color: rgba(34, 34, 34, 1);
      &:hover {
        color: var(--white);
      }
    `}
`;
