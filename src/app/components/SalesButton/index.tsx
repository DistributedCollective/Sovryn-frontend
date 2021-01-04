import React from 'react';
import styled from 'styled-components';
import { media } from '../../../styles/media';

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  border: none;
  background: rgba(254, 192, 4, 0.05);
  color: var(--gold);
  min-width: 48px;
  height: 48px;
  text-align: center;
  ${media.xl`
    background: none;
    min-width: 208px;
    height: 50px;
    padding: 2px 20px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid var(--gold);
  
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
