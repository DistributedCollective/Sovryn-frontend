import cn from 'classnames';
import React, { useCallback } from 'react';

import { handleNumber } from 'utils/helpers';

type InputType = 'text' | 'email' | 'password' | 'number';

interface InputProps {
  value: string;
  onChange?: (value: string) => void;
  appendElem?: React.ReactNode;
  type?: InputType;
  className?: string;
  inputClassName?: string;
  readOnly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function Input({
  value,
  onChange,
  className,
  inputClassName,
  appendElem,
  ...props
}: InputProps) {
  const handleChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        if (props.type === 'number') {
          onChange(handleNumber(newValue, true));
        } else {
          onChange(newValue);
        }
      }
    },
    [props.type, onChange],
  );

  return (
    <div
      className={cn('tw-input-wrapper', className, {
        readonly: props.readOnly,
      })}
    >
      <input
        className={cn('tw-input', inputClassName)}
        value={value}
        onChange={e => handleChange(e.currentTarget.value)}
        {...props}
      />
      {appendElem && <div className="tw-input-append">{appendElem}</div>}
    </div>
  );
}

Input.defaultProps = {
  inputClassName: 'tw-text-left',
};

interface DummyProps {
  value: React.ReactNode;
  appendElem?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  readOnly?: boolean;
}

export function DummyInput({
  value,
  appendElem,
  className,
  inputClassName,
  ...props
}: DummyProps) {
  return (
    <div
      className={cn('tw-input-wrapper', className, {
        readonly: props.readOnly,
      })}
    >
      <div className={cn('tw-input', inputClassName)}>{value}</div>
      {appendElem && <div className="tw-input-append">{appendElem}</div>}
    </div>
  );
}

DummyInput.defaultProps = {
  inputClassName: 'tw-text-left',
  readOnly: true,
};
