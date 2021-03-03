/**
 *
 * FieldGroup
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';

interface Props {
  label: React.ReactNode;
  children: React.ReactNode;
  labelColor: string;
}

export function FieldGroup(props: Props) {
  return (
    <Div className="tw-mb-3">
      <Label className="tw-mb-2" color={props.labelColor}>
        {props.label}
      </Label>
      <Content>{props.children}</Content>
    </Div>
  );
}

FieldGroup.defaultProps = {
  labelColor: 'var(--dark-gray)',
};

const Div = styled.div``;

const Content = styled.div``;

interface LabelProps {
  color: string;
}
const Label = styled(Text).attrs(_ => ({
  ellipsize: true,
}))`
  color: ${(props: LabelProps) => props.color};
  font-size: 14px;
`;
