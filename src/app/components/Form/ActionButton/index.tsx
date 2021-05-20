import React from 'react';
import cn from 'classnames';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  text: React.ReactNode;
  type?: ButtonType;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function ActionButton({
  text,
  loading,
  onClick,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={cn('tw-btn-action', className, {
        disabled: props.disabled,
        loading: loading,
      })}
    >
      <span className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-truncate">
        <span
          className={cn(
            'tw-flex-shrink-0 tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center tw-justify-start',
            {
              active: loading,
            },
          )}
        >
          <Spinner size={20} className="tw-fill-current tw-text-red-500" />
        </span>
        <span
          className={cn('tw-truncate tw-btn-loader__value', textClassName, {
            active: loading,
          })}
        >
          {text}
        </span>
      </span>
    </button>
  );
}

ActionButton.defaultProps = {
  type: 'button',
  className: 'tw-btn-action tw-flex tw-items-center tw-justify-center',
};
