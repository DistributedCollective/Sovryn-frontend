import React from 'react';
import classNames from 'classnames';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

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
      className={classNames(className, {
        disabled: props.disabled,
        loading: loading,
      })}
    >
      <span className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-truncate">
        <span
          className={classNames(
            'tw-flex-shrink-0 tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center tw-justify-start',
            {
              active: loading,
            },
          )}
        >
          <Spinner size={20} className="tw-fill-current tw-text-warning" />
        </span>
        <span
          className={classNames('tw-truncate tw-btn-loader__value', {
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
