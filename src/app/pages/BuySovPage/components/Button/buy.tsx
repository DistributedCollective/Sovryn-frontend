import React from 'react';
import styled, { css } from 'styled-components/macro';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
}

const StyledButton = styled.button`
  height: 60px;
  width: 100%;
  margin-top: 40px;
  border: 1px solid #17c3b2;
  color: #ffffff;
  padding: 11px;
  font-size: 24px;
  font-weight: 900;
  background: #17c3b2;
  border-radius: 10px;
  text-transform: none;
  line-height: 1;
  transition: background 0.3s;
  text-transform: uppercase;

  &:hover {
    opacity: 75%;
  }

  ${(props: BtnProps) =>
    props.disabled &&
    css`
      opacity: 25%;
    `}
`;

export function BuyButton(props: Props) {
  return (
    <StyledButton
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.text}
    </StyledButton>
  );
}
