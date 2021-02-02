/**
 *
 * TradeButton
 *
 */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Spinner, Text, Tooltip } from '@blueprintjs/core';
import { media } from '../../../styles/media';
import { ConditionalWrapper } from '../ConditionalWrapper';

interface Props {
  text: React.ReactNode;
  textColor: string;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  tooltip?: string | JSX.Element;
  tooltipProps?: any;
  hideIt?: boolean;
}

export function TradeButton(props: Props) {
  const handleClick = () => {
    if (!props.disabled) {
      props.onClick();
    }
  };

  return (
    <ConditionalWrapper
      condition={!!props.tooltip}
      wrapper={children => (
        <Tooltip content={props.tooltip} {...props.tooltipProps}>
          {children}
        </Tooltip>
      )}
    >
      <StyledButton
        as={props.disabled && props.tooltip ? 'a' : undefined}
        type={props.type}
        disabled={props.disabled}
        hideIt={props.hideIt}
        className="sovryn-border flex-grow-0 flex-shrink-0 font-family-montserrat font-weight-bold"
        textColor={props.textColor}
        onClick={handleClick}
      >
        <Text
          ellipsize
          className="d-flex flex-row align-items-center justify-content-center"
          tagName="span"
        >
          {props.loading && <Spinner className="mr-1" size={17} />}
          {props.text}
        </Text>
      </StyledButton>
    </ConditionalWrapper>
  );
}
TradeButton.defaultProps = {
  textColor: 'var(--white)',
  type: 'button',
  onClick: () => {},
};

interface StyledButtonProps {
  textColor: string;
  disabled?: boolean;
  hideIt?: boolean;
}

const StyledButton = styled.button`
  color: ${(props: StyledButtonProps) => props.textColor};
  background-color: var(--primary);
  border-radius: 20px;
  padding: 11px 22px;
  font-size: 12px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0;
  &:hover {
    text-decoration: none;
  }
  &:hover:not(:disabled) {
    color: var(--white);
  }
  &:disabled span {
    opacity: 0.7;
  }
  ${(props: StyledButtonProps) =>
    props.disabled &&
    css`
      cursor: not-allowed !important;
      & span {
        opacity: 0.7;
      }
    `}
    ${(props: StyledButtonProps) =>
      props.hideIt &&
      css`
        opacity: 0.2;
      `}
  ${media.lg`
  font-size: 14px
  `}
`;
