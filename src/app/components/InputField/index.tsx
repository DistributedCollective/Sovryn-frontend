import React from 'react';
import styled, { css } from 'styled-components/macro';

interface Props {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  invalid?: boolean;
}

export function InputField(props: Props) {
  return (
    <>
      <StyledWrapper invalid={props.invalid!}>
        <div className="d-flex align-items-center flex-grow-1">
          <StyledInput
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={e => props.onChange(e)}
          />
        </div>
        {props.rightElement && <>{props.rightElement}</>}
      </StyledWrapper>
    </>
  );
}

InputField.defaultProps = {
  type: 'text',
  invalid: false,
};

interface Wrapper {
  invalid: boolean;
}

const StyledWrapper = styled.label.attrs(_ => ({
  className: 'd-flex flex-row w-100 border rounded px-2 py-1 m-0',
}))`
  height: 48px;
  transition: 0.3s border-color;
  will-change: border-color;
  ${(props: Wrapper) =>
    props.invalid &&
    css`
      border-color: var(--danger) !important;
    `}
`;

const StyledInput = styled.input`
  background-color: transparent;
  width: 100%;
  color: var(--white);
  font-size: 16px;
  letter-spacing: 0;
  ::-webkit-input-placeholder {
    color: var(--light-gray);
  }
  :-ms-input-placeholder {
    color: var(--light-gray);
  }
  ::placeholder {
    color: var(--light-gray);
  }
`;
