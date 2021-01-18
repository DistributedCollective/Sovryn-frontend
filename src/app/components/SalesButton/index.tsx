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
  border-radius: 10px;
  color: var(--gold);
  min-width: 48px;
  height: 48px;
  font-family: 'Montserrat';
  font-weight: 300;
  letter-spacing: 0px;
  font-size: 18px;
  text-align: center;
  text-transform: inherit;
  transition: background 0.3s;
  padding: 0 4.2%;
  margin: 0 auto;
  ${media.xl`
    min-width: 240px;
    height: 50px;
    padding: 2px 20px 2px 20px;
    margin-left: 0;

    &:hover, &:focus {
      &:not([disabled]) {
        background: var(--gold25) !important;
      }
    }
    &:active:hover {
      &:not([disabled]) {
        background: var(--gold50) !important;
      }
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
