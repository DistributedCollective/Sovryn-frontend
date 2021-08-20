import React from 'react';
import styled from 'styled-components/macro';
import { Icon } from '@blueprintjs/core';

interface Props {
  text: string;
  onClick: () => void;
}

export function EmailNotificationButton(props: Props) {
  return (
    <StyledButton onClick={props.onClick}>
      <Icon icon="envelope" iconSize={16} className="tw-mr-2" />
      <span className="tw-text-sov-white">{props.text}</span>
    </StyledButton>
  );
}

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  color: var(--white);
  background-color: var(--gray-1);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--white);
  font-size: 0.75rem;
  :hover {
    color: var(--primary);
  }
  margin-left: 10px;
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;
