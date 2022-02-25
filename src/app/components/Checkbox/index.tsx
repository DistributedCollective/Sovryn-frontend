import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import styles from './index.module.scss';

export enum CheckboxAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

type CheckboxProps = {
  label: string | React.ReactNode;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  inline?: boolean;
  alignment?: CheckboxAlignment;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  inline = false,
  alignment = CheckboxAlignment.LEFT,
  className,
}) => {
  const onClick = useCallback(
    e => {
      e.preventDefault();
      !disabled && onChange();
    },
    [disabled, onChange],
  );

  const isRightAligned = useMemo(() => alignment === CheckboxAlignment.RIGHT, [
    alignment,
  ]);

  return (
    <div
      className={classNames(
        'tw-leading-none tw-mb-2.5',
        {
          'tw-inline-block': inline,
        },
        className,
      )}
    >
      <label
        className={classNames(styles.label, {
          [styles.labelDisabled]: disabled,
        })}
        onClick={onClick}
      >
        <input type="checkbox" className="tw-hidden" />
        <span
          className={classNames(
            styles.checkbox,
            checked && styles.checkboxChecked,
            {
              'tw-order-last tw-ml-2.5 tw-mr-0': isRightAligned,
              [styles.checkboxDisabled]: disabled,
            },
          )}
        />
        {label}
      </label>
    </div>
  );
};
