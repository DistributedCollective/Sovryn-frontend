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
  onChange: (value: string) => void;
}

function RadioGroup({ children, value, onChange }: Props) {
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
        className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center tw-rounded-lg tw-border tw-border-white tw-overflow-hidden tw-divide-x"
      >
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
      className={cn(
        'tw-flex-grow-0 tw-flex-shrink-1 tw-block tw-w-full tw-p-2 tw-cursor-pointer tw-m-0 tw-h-10 tw-flex tw-flex-row tw-items-center tw-justify-center tw-transition tw-truncate',
        {
          'tw-bg-secondary tw-bg-opacity-75': checked,
        },
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
        className={cn(
          'tw-w-full tw-font-semibold tw-flex tw-row tw-justify-center tw-items-center tw-opacity-25 tw-transition tw-truncate tw-whitespace-nowrap',
          {
            'tw-opacity-100': checked,
          },
        )}
      >
        {text}
      </div>
    </label>
  );
}

RadioGroup.Button = Button;

export default RadioGroup;
