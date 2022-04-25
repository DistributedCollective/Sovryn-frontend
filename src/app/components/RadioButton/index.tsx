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

  const colorClassMap: Record<RadioButtonColor, string> = useMemo(() => {
    return {
      tradeShort: styles.tradeShort,
      secondary: styles.secondary,
      tradeLong: styles.tradeLong,
      success: styles.success,
      warning: styles.warning,
      primary: styles.primary,
      gray: styles.gray,
    };
  }, []);

  const sizeClassMap: Record<RadioButtonSize, string> = useMemo(() => {
    return {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      xl: styles.xl,
    };
  }, []);

  const styleClassMap: Record<RadioButtonStyle, string> = useMemo(() => {
    return {
      transparent: styles.transparent,
      frosted: styles.frosted,
      normal: styles.normal,
    };
  }, []);

  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.button,
        sizeClassMap[size],
        styleClassMap[style],
        colorClassMap[color],
        merged && styles.merged,
        disabled && styles.disabled,
        fullWidth && 'tw-w-full',
      ),
    [
      colorClassMap,
      styleClassMap,
      sizeClassMap,
      fullWidth,
      disabled,
      merged,
      color,
      style,
      size,
    ],
  );

  return (
    <div
      className={classNames('tw-flex tw-items-center', {
        'tw-space-x-2': !merged,
      })}
      role="radiogroup"
    >
      {entries.map(
        ({
          value,
          text,
          color: colorButton,
          disabled: disabledButton,
          dataActionId,
        }) => (
          <label
            key={value}
            className={classNames(
              classNameComplete,
              colorButton && styles[colorButton],
              disabledButton && styles.disabled,
              value === selected && styles.selected,
              {
                'tw-opacity-100':
                  value === isSelected && !disabled && !disabledButton,
              },
            )}
          >
            <input
              className="tw-absolute tw-invisible tw-w-0 tw-h-0"
              type="radio"
              value={value}
              checked={isSelected === value}
              disabled={disabled || disabledButton}
              onChange={({ target }) => handleOnChange(target.value)}
              data-action-id={dataActionId}
            />
            <span className="tw-flex tw-items-center tw-justify-center tw-capitalize">
              {text}
            </span>
          </label>
        ),
      )}
    </div>
  );
};
