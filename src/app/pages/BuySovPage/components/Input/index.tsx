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
  dataActionId?: string;
}

export function Input(props: Props) {
  return (
    <>
      <StyledWrapper invalid={props.invalid!}>
        <div className="tw-flex tw-items-center tw-flex-grow">
          <StyledInput
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={e => props.onChange(handleNumberInput(e, true))}
            data-action-id={props.dataActionId}
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
    'tw-flex tw-flex-row tw-w-full tw-border tw-rounded tw-px-2 tw-py-1 tw-m-0 tw-justify-between tw-items-center',
}))`
  height: 40px;
  transition: 0.3s border-color;
  will-change: border-color;
  color: #000;
  background: #e8e8e8;
  font-weight: 500;
  ${(props: Wrapper) =>
    props.invalid &&
    css`
      border-color: var(--warning) !important;
    `}
`;

const StyledInput = styled.input`
  background-color: #e8e8e8;
  width: 100%;
  color: #000;
  font-size: 1rem;
  padding-left: 40px;
  font-weight: 500;
  letter-spacing: 0;
  text-align: center;
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
