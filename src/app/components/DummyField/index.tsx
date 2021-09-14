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
    <Div className="tw-flex tw-flex-row tw-items-center tw-justify-between">
      {props.children}
    </Div>
  );
}

const Div = styled.div`
  border-radius: 0.5rem;
  border: 1px solid var(--gray-3);
  color: var(--white);
  padding: 10px 14px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0;
  height: 40px;
`;
