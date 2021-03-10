import React from 'react';
import classNames from 'classnames';
import styles from './index.module.css';

type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  text: React.ReactNode;
  onClick?: () => void;
  inverted?: boolean;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
export function Button({ text, inverted, loading, ...props }: Props) {
  return (
    <button
      {...props}
      className={classNames(
        styles.button,
        props.className,
        inverted && styles.inverted,
        props.disabled && styles.disabled,
      )}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  inverted: false,
  onClick: () => {},
};
