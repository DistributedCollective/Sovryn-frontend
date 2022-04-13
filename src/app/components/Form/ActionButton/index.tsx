import React from 'react';
import classNames from 'classnames';
import { Spinner, SpinnerSize } from 'app/components/Spinner';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  text: React.ReactNode;
  title?: string;
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
      className={classNames('tw-btn-action', className, {
        disabled: props.disabled,
        loading: loading,
      })}
    >
      <span className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-truncate">
        <span
          className={classNames(
            'tw-flex-shrink-0 tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center tw-justify-start',
            {
              active: loading,
            },
          )}
        >
          <Spinner size={SpinnerSize.SM} className="tw-fill-current" />
        </span>
        <span
          className={classNames('tw-btn-loader__value', textClassName, {
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

interface LinkProps extends React.AnchorHTMLAttributes<any> {
  text: React.ReactNode;
}

export function ActionLink({ text, ...props }: LinkProps) {
  return (
    <a
      {...props}
      className={classNames(
        'tw-btn-action tw-flex tw-flex-row tw-justify-center tw-items-center tw-no-underline hover:tw-no-underline',
      )}
    >
      <span className={classNames('tw-truncate')}>{text}</span>
    </a>
  );
}
