import React from 'react';
import classNames from 'classnames';
import { IBtnProps } from './types';

interface ICloseButtonProps extends IBtnProps {
  text: React.ReactNode;
  className?: string;
  dataActionId?: string;
}

export const CloseButton: React.FC<ICloseButtonProps> = ({
  onClick,
  disabled,
  className,
  dataActionId,
  text,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      className,
      'tw-w-full tw-bg-primary tw-font-normal tw-bg-opacity-0 tw-hover:text-primary tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-2 tw-text-lg tw-text-primary tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl hover:tw-no-underline tw-no-underline',
    )}
    data-action-id={dataActionId}
  >
    {text}
  </button>
);
