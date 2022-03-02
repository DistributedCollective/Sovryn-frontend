import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Text, Tooltip } from '@blueprintjs/core';
import { media } from '../../../styles/media';
import { ConditionalWrapper } from '../ConditionalWrapper';
import { Spinner } from '../Spinner';

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
  dataActionId?: string;
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
        className="sovryn-border tw-flex-grow-0 tw-flex-shrink-0 tw-font-bold"
        textColor={props.textColor}
        onClick={handleClick}
        data-action-id={props.dataActionId}
      >
        <Text
          ellipsize
          className="tw-flex tw-flex-row tw-items-center tw-justify-center"
          tagName="span"
        >
          {props.loading && <Spinner className="tw-mr-1" size={20} />}
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
  background-color: var(--gray-1);
  border-radius: 1.25rem;
  padding: 11px 22px;
  font-size: 0.75rem;
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
  font-size: 0.875rem
  `}
`;
