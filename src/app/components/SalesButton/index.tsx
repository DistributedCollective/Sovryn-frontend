import React from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../styles/media';

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  border: 1px solid var(--gold);
  background: none;
  border-radius: 8px;
  color: var(--gold);
  min-width: 48px;
  height: 48px;
  text-align: center;
  ${media.xl`
    min-width: 208px;
    height: 50px;
    padding: 2px 20px;
    font-weight: 600;
  
    &:hover, &:active, &:focus {
      background: var(--gold) !important;
      color: black !important;
    }
    `}
`;

interface Props {
  text: string;
  onClick: () => void;
}
export default function SalesButton({ text, onClick }: Props) {
  return <StyledButton onClick={() => onClick()}>{text}</StyledButton>;
}
