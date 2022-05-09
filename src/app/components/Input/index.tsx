import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import { InputBase, InputBaseProps } from './InputBase';
import styles from './index.module.scss';

export type InputProps = Omit<InputBaseProps, 'ref'> & {
  classNameInput?: string;
  invalid?: boolean;
  unit?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, classNameInput, type, invalid, unit, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null) as React.MutableRefObject<
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

    const wrapperClasses = useMemo(() => {
      return {
        'tw-border-sov-white': rest.readOnly,
        'tw-border-warning tw-bg-warning':
          typeof invalid !== 'undefined' && invalid,
        'tw-border-success tw-bg-success':
          typeof invalid !== 'undefined' && !invalid,
      };
    }, [invalid, rest.readOnly]);

    return (
      <div className={classNames(styles.wrapper, wrapperClasses, className)}>
        <div className="tw-relative tw-flex-grow">
          <InputBase
            ref={inputRef}
            className={classNames(
              styles.input,
              { 'tw-rounded-lg': !unit, 'tw-rounded-l-lg': !!unit },
              classNameInput,
            )}
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
        {unit && (
          <div
            className={classNames(
              'tw-w-full tw-h-8 tw-max-w-24 tw-px-3 tw-flex tw-items-center tw-justify-center tw-leading-none tw-text-base tw-font-semibold tw-rounded-r-lg',
              {
                'tw-bg-gray-9 tw-text-gray-5': !rest.readOnly,
                'tw-bg-transparent tw-text-sov-white': rest.readOnly,
              },
            )}
          >
            <div>{unit}</div>
          </div>
        )}
      </div>
    );
  },
);
