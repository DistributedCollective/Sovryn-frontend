import React, { createContext, useContext, useEffect, useState } from 'react';
import cn from 'classnames';

export const RadioContext = createContext<any>(null);

export function useRadioContext() {
  // we could use array destructuring if we want
  // const [state, onChange] = React.useContext(RadioContext);
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
  title?: string;
  onChange: (value: string) => void;
}

function RadioGroup({ children, value, title, onChange }: Props) {
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
      <div className="tw-radio-group-title">{title}</div>
      <div role="radiogroup" className="tw-radio-group-content">
        {children}
      </div>
    </RadioContext.Provider>
  );
}

interface ButtonProps {
  value: string;
  text?: React.ReactNode;
}

function Button({ value, text }: ButtonProps) {
  const [state, onChange] = useRadioContext();
  const checked = value === state;
  return (
    <label
      className={cn('tw-radio-group__label', {
        'tw-radio-group__label--active': checked,
      })}
    >
      <input
        className="tw-invisible tw-w-0 tw-h-0"
        value={value}
        checked={checked}
        type="radio"
        onChange={({ target }) => onChange(target.value)}
      />
      <div
        className={cn('tw-radio-group__label-content', {
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
