import React, {
  useState,
  HTMLProps,
  useCallback,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
  useMemo,
} from 'react';
import debounceCallback from 'lodash.debounce';

export type InputBaseProps = Omit<HTMLProps<HTMLInputElement>, 'ref'> & {
  debounce?: number;
  dataActionId?: string;
  onChangeText?: (value: string) => void;
  /** @deprecated Use onChangeText if possible */
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    { value, debounce = 500, dataActionId, onChange, onChangeText, ...props },
    ref,
  ) => {
    const [renderedValue, setRenderedValue] = useState<
      string | string[] | number | undefined
    >(value);

    const debouncedOnChangeHandler = useMemo(
      () =>
        debounceCallback((event: ChangeEvent<HTMLInputElement>) => {
          // some inputs may depend on currentTarget, but it may be nullified when debouncing completes
          // assigning event.target for backwards compability.
          if (event.currentTarget === null) {
            event.currentTarget = event.target;
          }
          onChangeText?.(event.currentTarget.value);
          onChange?.(event);
        }, debounce),
      [debounce, onChange, onChangeText],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setRenderedValue(event.currentTarget?.value);
        debouncedOnChangeHandler(event);
      },
      [debouncedOnChangeHandler],
    );

    // updating value if it was changed by parent component
    useEffect(() => setRenderedValue(value), [value]);

    return (
      <input
        {...props}
        ref={ref}
        value={renderedValue}
        onChange={handleChange}
        data-action-id={dataActionId}
      />
    );
  },
);
