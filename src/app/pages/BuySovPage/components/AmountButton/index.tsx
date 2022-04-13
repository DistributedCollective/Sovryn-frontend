import React from 'react';
import styled from 'styled-components/macro';

interface Props {
  onChange: (value: number) => void;
  dataActionId?: string;
}

const items = [10, 25, 50, 75, 100];

export function AmountButton(props: Props) {
  return (
    <Container className="tw-flex tw-flex-row tw-items-center tw-justify-around">
      {items.map(item => (
        <Button
          key={item}
          onClick={() => props.onChange(item)}
          data-action-id={`${props.dataActionId}-amountSelectorButton-${item}%`}
        >
          {item}%
        </Button>
      ))}
    </Container>
  );
}

const Container = styled.div``;
const Button = styled.button`
  height: 30px;
  border: 1px solid #0392e8;
  color: #0392e8;
  background: transparent;
  width: 100%;
  border-right: 0;
  transition: background-color;
  font-size: 0.875rem;
  font-weight: 500;
  &:last-of-type {
    border-right: 1px solid #0392e8;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  &:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:hover {
    background-color: rgba(34, 116, 165, 50%);
  }
`;
