import React from 'react';
import { StyledWrapper, StyledInput, RightElement } from './styled';

interface Props {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  invalid?: boolean;
  isLight?: boolean;
  disabled?: boolean;
}

export function InputField(props: Props) {
  return (
    <>
      <StyledWrapper invalid={props.invalid!} isLight={props.isLight!}>
        <div className="d-flex align-items-center flex-grow-1">
          <StyledInput
            type={props.type}
            value={props.value}
            isLight={props.isLight!}
            disabled={props.disabled!}
            placeholder={props.placeholder}
            onChange={e => props.onChange(e)}
          />
        </div>
        {props.rightElement && (
          <RightElement isLight={props.isLight!}>
            {props.rightElement}
          </RightElement>
        )}
      </StyledWrapper>
    </>
  );
}

InputField.defaultProps = {
  type: 'text',
  invalid: false,
  isLight: false,
};
