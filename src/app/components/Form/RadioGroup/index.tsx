import React, { createContext, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

export const RadioContext = createContext<any>(null);

export function useRadioContext() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error(
      `Radio compound components cannot be rendered outside the Radio component`,
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function RadioGroup({ children, value, onChange, className }: Props) {
  const [state, setState] = useState('');

  function handleOnChange(value: string) {
    setState(value);
    onChange(value);
  }

  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <RadioContext.Provider value={[state, handleOnChange]}>
      <div
        role="radiogroup"
        className={classNames('tw-radio-group', className)}
      >
        {children}
      </div>
    </RadioContext.Provider>
  );
}

interface ButtonProps {
  value: string;
  text?: React.ReactNode;
  className?: string;
}

function Button({ value, text, className }: ButtonProps) {
  const [state, onChange] = useRadioContext();
  const checked = value === state;
  return (
    <label
      className={classNames(
        'tw-radio-group__label',
        {
          'tw-radio-group__label--active': checked,
        },
        className,
      )}
    >
      <input
        className="tw-invisible tw-w-0 tw-h-0"
        value={value}
        checked={checked}
        type="radio"
        onChange={({ target }) => onChange(target.value)}
      />
      <div
        className={classNames('tw-radio-group__label-content', {
          'tw-radio-group__label-content--active': checked,
        })}
      >
        {text}
      </div>
    </label>
  );
}

RadioGroup.Button = Button;

export default RadioGroup;
