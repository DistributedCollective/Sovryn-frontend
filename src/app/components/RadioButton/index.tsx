import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import {
  MinimumTwoEntries,
  RadioButtonColor,
  RadioButtonSize,
  RadioButtonStyle,
} from './types';

type RadioButtonProps = {
  merged: boolean;
  entries: MinimumTwoEntries;
  onChange: (value: any) => void;
  size?: RadioButtonSize;
  color?: RadioButtonColor;
  style?: RadioButtonStyle;
  disabled?: boolean;
  selected?: any;
  fullWidth?: boolean;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  merged,
  entries,
  onChange,
  size = RadioButtonSize.md,
  color = RadioButtonColor.secondary,
  style = RadioButtonStyle.normal,
  disabled,
  selected = undefined,
  fullWidth,
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleOnChange = useCallback(
    value => {
      setIsSelected(value);
      onChange(value);
    },
    [onChange],
  );

  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.button,
        size && styles[size],
        color && styles[color],
        style && styles[style],
        merged && styles.merged,
        disabled && styles.disabled,
        fullWidth && 'tw-w-full',
      ),
    [color, size, style, disabled, merged, fullWidth],
  );

  return (
    <div
      className={classNames('tw-flex tw-items-center', {
        'tw-space-x-2': !merged,
      })}
      role="radiogroup"
    >
      {entries.map(({ value, text, color, dataActionId }) => (
        <label
          key={value}
          className={classNames(
            classNameComplete,
            color && styles[color],
            value === selected && styles.selected,
            {
              'tw-opacity-100': value === isSelected && !disabled,
            },
          )}
        >
          <input
            className="tw-absolute tw-invisible tw-w-0 tw-h-0"
            type="radio"
            value={value}
            checked={isSelected === value}
            disabled={disabled}
            onChange={({ target }) => handleOnChange(target.value)}
            data-action-id={dataActionId}
          />
          <span className="tw-flex tw-items-center tw-justify-center tw-capitalize">
            {text}
          </span>
        </label>
      ))}
    </div>
  );
};
