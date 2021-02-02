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
  color: var(--light-gray);
  padding: 5px 10px;
  background: transparent;
  font-size: 18px;
  font-weight: 100;
  font-family: Montserrat;
  text-transform: none;
  &:hover {
    color: var(--LightGrey);
  }
  ${(props: StyledProps) =>
    props.active &&
    css`
      font-weight: 400;
      &:hover {
        color: var(--white);
      }
    `}
`;
