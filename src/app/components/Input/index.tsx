import React, { useCallback, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import { InputBase, InputBaseProps } from './InputBase';
import styles from './index.module.scss';

type InputProps = InputBaseProps & {
  classNameInput?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, classNameInput, type, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>() as React.MutableRefObject<
      HTMLInputElement
    >;

    useImperativeHandle(ref, () => inputRef.current);

    const onStepUp = useCallback(
      event => {
        inputRef.current?.stepUp();
        rest.onChangeText?.(inputRef.current?.value || '');
        rest.onChange?.(event);
      },
      [rest],
    );

    const onStepDown = useCallback(
      event => {
        inputRef.current?.stepDown();
        rest.onChangeText?.(inputRef.current?.value || '');
        rest.onChange?.(event);
      },
      [rest],
    );

    return (
      <div className={classNames('tw-relative', className)}>
        <InputBase
          ref={inputRef as any}
          className={classNames(styles.input, classNameInput)}
          type={type}
          {...rest}
        />
        {type === 'number' && rest.step ? (
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
        ) : null}
      </div>
    );
  },
);
