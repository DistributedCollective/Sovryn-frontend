import React from 'react';
import styled, { css } from 'styled-components/macro';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
}

const StyledButton = styled.button`
  height: 40px;
  width: 100%;
  margin-top: 40px;
  border: 1px solid #fec004;
  color: #fec004;
  padding: 11px;
  font-size: 16px;
  font-weight: 500;
  background: rgba(254, 192, 4, 0.05);
  border-radius: 10px;
  text-transform: none;
  line-height: 1;
  transition: background 0.3s;

  &:hover {
    background: rgba(254, 192, 4, 0.25);
  }

  ${(props: BtnProps) =>
    props.disabled &&
    css`
      opacity: 25%;
    `}
`;

export function Button(props: Props) {
  return (
    <StyledButton onClick={props.onClick} disabled={props.disabled}>
      {props.text}
    </StyledButton>
  );
}
