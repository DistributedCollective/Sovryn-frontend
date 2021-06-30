import React from 'react';
import styled, { css } from 'styled-components/macro';
import cn from 'classnames';

interface Props {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  invalid?: boolean;
  isOnDarkBackground?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
}

export function InputField(props: Props) {
  return (
    <>
      <StyledWrapper
        invalid={props.invalid!}
        isOnDarkBackground={props.isOnDarkBackground}
        className={cn(
          'tw-flex tw-flex-row tw-w-full tw-border tw-rounded tw-px-2 tw-py-1 tw-m-0',
          props.wrapperClassName,
        )}
      >
        <div className="tw-flex tw-items-center tw-flex-grow">
          <StyledInput
            type={props.type}
            value={props.value}
            placeholder={props.placeholder}
            onChange={e => props.onChange(e)}
            className={props.inputClassName}
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
  isOnDarkBackground?: boolean;
}

const StyledWrapper = styled.label`
  height: 48px;
  transition: 0.3s border-color;
  will-change: border-color;
  ${(props: Wrapper) =>
    props.invalid &&
    css`
      border-color: var(--danger) !important;
    `}
  ${(props: Wrapper) =>
    props.isOnDarkBackground &&
    css`
      background-color: var(--white) !important;
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
