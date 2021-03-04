/**
 *
 * TradeButton
 *
 */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Spinner, Text } from '@blueprintjs/core';

interface Props {
  text: React.ReactNode;
  textColor: string;
  backgroundColor: string;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export function DialogButton(props: Props) {
  return (
    <StyledButton
      type={props.type}
      disabled={props.disabled}
      className="sovryn-border"
      $textColor={props.textColor}
      $backgroundColor={props.backgroundColor}
      onClick={() => props.onClick()}
    >
      <Text
        ellipsize
        className="tw-flex tw-flex-row tw-items-center"
        tagName="span"
      >
        {props.loading && <Spinner className="tw-mr-1" size={17} />}
        {props.text}
      </Text>
    </StyledButton>
  );
}
DialogButton.defaultProps = {
  textColor: 'var(--black)',
  backgroundColor: 'var(--teal)',
  type: 'button',
  onClick: () => {},
};

interface StyledButtonProps {
  $textColor: string;
  $backgroundColor: string;
  disabled?: boolean;
}

const StyledButton = styled.button`
  color: ${(props: StyledButtonProps) => props.$textColor};
  background-color: ${(props: StyledButtonProps) => props.$backgroundColor};
  border-radius: 20px;
  padding: 11px 22px;
  font-size: 14px;
  &:hover:not(:disabled) {
    color: var(--white);
  }
  &:disabled span {
    opacity: 0.7;
  }
  ${(props: StyledButtonProps) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;
