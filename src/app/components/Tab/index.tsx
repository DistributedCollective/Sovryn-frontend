import React from 'react';
import styled, { css } from 'styled-components';
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
  color: var(--primary);
  background-color: var(--light-gray);
  padding: 9px 11px;
  border-radius: 8px;
  ${(props: StyledProps) =>
    props.active &&
    css`
      background-color: var(--white);
      &:hover {
        color: var(--primary);
      }
    `}
`;
