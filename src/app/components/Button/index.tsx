import React, { MouseEventHandler, useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

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
  /** Inline/Minor buttons, height 30px */
  sm = 'sm',
  /** Standard buttons, height 40px */
  md = 'md',
  /** Minor CTA buttons, height 50px */
  lg = 'lg',
  /** Major CTA buttons, height 50px */
  xl = 'xl',
}

export enum ButtonStyle {
  normal = 'normal',
  inverted = 'inverted',
  transparent = 'transparent',
  frosted = 'frosted',
  link = 'link',
}

interface IButtonProps {
  text: React.ReactNode;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  type?: ButtonType;
  color?: ButtonColor;
  size?: ButtonSize;
  style?: ButtonStyle;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  dataActionId?: string;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  href,
  hrefExternal,
  onClick,
  color,
  size,
  style,
  type,
  loading,
  disabled,
  className,
  dataActionId,
}) => {
  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.button,
        loading && styles.loading,
        color && styles[color],
        size && styles[size],
        style && styles[style],
        disabled && styles.disabled,
        className,
      ),
    [loading, color, size, style, disabled, className],
  );

  const onClickWhenAllowed = !disabled && !loading ? onClick : undefined;

  if (href) {
    if (hrefExternal) {
      return (
        <a
          className={classNameComplete}
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={onClickWhenAllowed}
          data-action-id={dataActionId}
        >
          {text}
        </a>
      );
    } else {
      return (
        <Link
          to={href}
          className={classNameComplete}
          onClick={onClickWhenAllowed}
          data-action-id={dataActionId}
        >
          {text}
        </Link>
      );
    }
  } else {
    return (
      <button
        type={type}
        disabled={disabled}
        className={classNameComplete}
        onClick={onClickWhenAllowed}
        data-action-id={dataActionId}
      >
        {text}
      </button>
    );
  }
};

Button.defaultProps = {
  type: ButtonType.button,
  color: ButtonColor.primary,
  size: ButtonSize.md,
  style: ButtonStyle.normal,
};
