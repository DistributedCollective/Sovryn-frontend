import React from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../styles/media';
import { Spinner } from '@blueprintjs/core';

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
  className: 'd-flex flex-row justify-content-center align-items-center',
}))`
  border: 1px solid var(--gold);
  background: var(--gold5);
  border-radius: 8px;
  color: var(--gold);
  min-width: 48px;
  height: 48px;
  text-align: center;
  text-transform: inherit;
  transition: background 0.3s;
  ${media.xl`
    min-width: 240px;
    height: 50px;
    padding: 2px 20px;
    font-weight: 400;

    &:hover, &:focus {
      background: var(--gold25) !important;
    }
    &:active:hover {
      background: var(--gold50) !important;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    `}
`;

interface Props {
  text: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function SalesButton({
  text,
  onClick,
  disabled,
  loading,
}: Props) {
  return (
    <StyledButton onClick={() => onClick()} disabled={disabled}>
      {text}
      {loading && <Spinner size={18} className="ml-2" />}
    </StyledButton>
  );
}
