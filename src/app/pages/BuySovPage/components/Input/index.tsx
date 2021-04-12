/**
 *
 * AmountField
 *
 */

import React from 'react';
import { handleNumberInput } from 'utils/helpers';
import styled, { css } from 'styled-components/macro';

interface Props {
  value: string;
  onChange: (value: string) => void;
  rightElement?: React.ReactNode;

  type: string;
  placeholder?: string;
  invalid?: boolean;
}

export function Input(props: Props) {
  return (
    <>
      <StyledWrapper invalid={props.invalid!}>
        <div className="d-flex align-items-center flex-grow-1">
          <StyledInput
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={e => props.onChange(handleNumberInput(e, true))}
          />
        </div>
        {props.rightElement && <>{props.rightElement}</>}
      </StyledWrapper>
    </>
  );
}

interface Wrapper {
  invalid: boolean;
}

const StyledWrapper = styled.label.attrs(_ => ({
  className:
    'd-flex flex-row w-100 border rounded px-2 py-1 m-0 justify-content-between align-items-center',
}))`
  height: 48px;
  transition: 0.3s border-color;
  will-change: border-color;
  color: #000;
  background: #e9eae9;
  font-weight: 500;
  ${(props: Wrapper) =>
    props.invalid &&
    css`
      border-color: var(--danger) !important;
    `}
`;

const StyledInput = styled.input`
  background-color: #e9eae9;
  width: 100%;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  ::-webkit-input-placeholder {
    color: #000;
  }
  :-ms-input-placeholder {
    color: #000;
  }
  ::placeholder {
    color: #000;
  }
`;
