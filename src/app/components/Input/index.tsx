import { HTMLInputProps } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';
import styles from './index.module.scss';

type InputProps = {
  value?: HTMLInputProps['value'];
  type: HTMLInputProps['type'];
  placeholder?: HTMLInputProps['placeholder'];
  min?: HTMLInputProps['min'];
  max?: HTMLInputProps['max'];
  step?: HTMLInputProps['step'];
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  dataActionId?: string;
  onChange: (value: HTMLInputElement['value']) => void;
};

export const Input: React.FC<InputProps> = ({
  className,
  type,
  step,
  dataActionId,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeWrapper = useCallback(event => onChange(event.target.value), [
    onChange,
  ]);

  const onStepUp = useCallback(event => inputRef.current?.stepUp(), []);
  const onStepDown = useCallback(event => inputRef.current?.stepDown(), []);

  return (
    <div className={classNames('tw-relative', className)}>
      <input
        ref={inputRef}
        className={styles.input}
        type={type}
        step={step}
        data-action-id={dataActionId}
        onChange={onChangeWrapper}
        {...rest}
      />
      {type === 'number' && step && (
        <>
          <button
            className={classNames(styles.stepButton, styles.up)}
            onClick={onStepUp}
          >
            <span />
          </button>
          <button
            className={classNames(styles.stepButton, styles.down)}
            onClick={onStepDown}
          >
            <span />
          </button>
        </>
      )}
    </div>
  );
};
