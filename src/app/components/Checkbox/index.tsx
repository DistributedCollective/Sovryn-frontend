import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './index.module.scss';

export enum CheckboxAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

type CheckboxProps = {
  label: React.ReactNode;
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
        className={classNames(
          'tw-relative tw-cursor-pointer tw-flex tw-items-center tw-normal-case',
          {
            'tw-cursor-not-allowed tw-opacity-50': disabled,
          },
        )}
      >
        <input
          type="checkbox"
          className={styles.hiddenInput}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span
          className={classNames(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            'tw-order-last tw-ml-2.5 tw-mr-0': isRightAligned,
            'tw-opacity-50': disabled,
          })}
          aria-hidden="true"
        />
        {label}
      </label>
    </div>
  );
};
