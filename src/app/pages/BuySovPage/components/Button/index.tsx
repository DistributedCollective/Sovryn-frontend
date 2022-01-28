import React from 'react';
import styled, { css } from 'styled-components/macro';
import { IBtnProps } from './types';

interface IButtonProps extends IBtnProps {
  text: React.ReactNode;
}

const StyledButton = styled.button`
  height: 40px;
  width: 100%;
  margin-top: 0;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 11px;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(254, 192, 4, 0.05);
  border-radius: 0.75rem;
  text-transform: none;
  line-height: 1;
  transition: background 0.3s;

  &:hover {
    background: rgba(254, 192, 4, 0.25);
  }

  ${(props: IBtnProps) =>
    props.disabled &&
    css`
      opacity: 25%;
      cursor: not-allowed;
      &:hover {
        background: transparent;
      }
    `}
`;

export function Button({ text, onClick, disabled }: IButtonProps) {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {text}
    </StyledButton>
  );
}
