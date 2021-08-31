import React, { MouseEventHandler, useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export enum ButtonType {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}

export enum ButtonColor {
  primary = 'primary',
  secondary = 'secondary',
  tradeLong = 'tradeLong',
  tradeShort = 'tradeShort',
  success = 'success',
  warning = 'warning',
}

export enum ButtonSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export enum ButtonStyle {
  normal = 'normal',
  inverted = 'inverted',
  transparent = 'transparent',
  frosted = 'frosted',
  link = 'link',
}

interface ButtonProps {
  text: React.ReactNode;
  onClick?: MouseEventHandler;
  type?: ButtonType;
  color?: ButtonColor;
  size?: ButtonSize;
  style?: ButtonStyle;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  color,
  size,
  style,
  type,
  loading,
  disabled,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        styles.button,
        loading && styles.loading,
        color && styles[color],
        size && styles[size],
        style && styles[style],
        className,
      )}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  type: ButtonType.button,
  color: ButtonColor.primary,
  size: ButtonSize.md,
  style: ButtonStyle.normal,
};
