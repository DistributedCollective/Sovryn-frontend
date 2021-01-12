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
  width?: number;
}

export function Tab(props: Props) {
  return (
    <StyledTab
      active={props.active}
      onClick={() => props.onClick()}
      opacity={props.opacity}
      background={props.background}
      width={props.width}
    >
      {props.children}
    </StyledTab>
  );
}

interface StyledProps {
  active: boolean;
  opacity?: number;
  background?: string;
  width?: number;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 15px;
  border-radius: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-transform: none;
  font-size: 12px;
  width: 140px;
  ${(props: StyledProps) =>
    props.width &&
    css`
      width: ${props.width}px;
    `}
  height: 60px;
  img {
    margin-right: 10px;
  }
  ${media.lg`font-size: 1rem;`}
  ${(props: StyledProps) =>
    props.active &&
    css`
      opacity: 1;
    `}
`;
