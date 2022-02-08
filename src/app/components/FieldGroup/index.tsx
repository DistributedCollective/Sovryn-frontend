/**
 *
 * FieldGroup
 *
 */
import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import cn from 'classnames';

interface Props {
  label: React.ReactNode;
  children: React.ReactNode;
  labelColor?: string;
  className?: string;
  dataActionId?: string;
}

export function FieldGroup(props: Props) {
  return (
    <Div className={cn('tw-mb-4', props.className)}>
      <Label className="tw-mb-2 tw-text-sov-white" color={props.labelColor}>
        {props.label}
      </Label>
      <Content data-action-id={props.dataActionId}>{props.children}</Content>
    </Div>
  );
}

FieldGroup.defaultProps = {};

const Div = styled.div``;

const Content = styled.div``;

interface LabelProps {
  color?: string;
}
const Label = styled(Text).attrs(_ => ({
  ellipsize: true,
}))`
  ${(props: LabelProps) =>
    props.color &&
    css`
      color: ${props.color};
    `}
  font-size: 0.875rem;
`;
