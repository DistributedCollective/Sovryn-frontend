/**
 *
 * DummyField
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

interface Props {
  children: React.ReactNode;
}

export function DummyField(props: Props) {
  return (
    <Div className="tw-flex tw-flex-row tw-items-center">{props.children}</Div>
  );
}

const Div = styled.div`
  border-radius: 0.375rem;
  background-color: var(--gray-3);
  color: var(--white);
  padding: 10px 14px;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0;
  height: 48px;
`;
