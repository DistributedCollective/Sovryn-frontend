import React from 'react';
import cn from 'classnames';
import { Spinner } from 'app/components/Spinner';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  text: React.ReactNode;
  type?: ButtonType;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  text,
  loading,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={cn(className, {
        disabled: props.disabled,
        loading: loading,
      })}
    >
      <span className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-truncate">
        <span
          className={cn(
            'tw-flex-shrink-0 tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center tw-justify-start',
            {
              active: loading,
            },
          )}
        >
          <Spinner size={20} className="tw-fill-current tw-text-warning" />
        </span>
        <span
          className={cn('tw-truncate tw-btn-loader__value', {
            active: loading,
          })}
        >
          {text}
        </span>
      </span>
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  className: 'tw-btn',
};
