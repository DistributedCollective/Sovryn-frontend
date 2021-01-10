import React from 'react';
import styled, { css } from 'styled-components/macro';
import { media } from '../../../styles/media';

interface Props {
  text: string;
  active: boolean;
  children?: React.ReactNode;
  onClick: () => void;
  background?: string;
  opacity?: number;
}

export function Tab(props: Props) {
  return (
    <StyledTab
      active={props.active}
      onClick={() => props.onClick()}
      opacity={props.opacity}
      background={props.background}
    >
      {props.children}
    </StyledTab>
  );
}

interface StyledProps {
  active: boolean;
  opacity?: number;
  background?: string;
}
const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  className: 'btn',
}))`
  color: white;
  background: black;
  ${(props: StyledProps) =>
    props.background &&
    css`
      background: ${props.background};
    `}
  opacity: 0.25;
  ${(props: StyledProps) =>
    props.opacity &&
    css`
      opacity: ${props.opacity};
    `}
  padding: 9px 11px;
  border-radius: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-size: 12px;
  width: 160px;
  ${media.lg`font-size: 1rem;`}
  ${(props: StyledProps) =>
    props.active &&
    css`
      opacity: 1;
    `}
`;
