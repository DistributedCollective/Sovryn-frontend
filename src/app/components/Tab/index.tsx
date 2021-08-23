import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Text } from '@blueprintjs/core';

interface Props {
  text: string;
  active: boolean;
  onClick: () => void;
}

export function Tab(props: Props) {
  return (
    <StyledTab active={props.active} onClick={() => props.onClick()}>
      <Text ellipsize>{props.text}</Text>
    </StyledTab>
  );
}

interface StyledProps {
  active: boolean;
}
const StyledTab = styled.button.attrs(_ => ({
  type: 'button',
  className: 'btn',
}))`
  color: var(--white);
  opacity: 0.25;
  padding: 0.313rem 0.625rem;
  background: transparent;
  font-size: 1rem;
  line-height: 1.188rem;
  font-weight: 600;
  font-family: Montserrat;
  text-transform: none;
  margin-right: 0.65rem;
  &:hover {
    opacity: 0.75;
  }
  ${(props: StyledProps) =>
    props.active &&
    css`
      opacity: 1;
      &:hover {
        opacity: 1;
      }
    `}
`;
