import classNames from 'classnames';
import React from 'react';
import { IBtnProps } from './types';

interface IButtonProps extends IBtnProps {
  text: React.ReactNode;
  dataActionId?: string;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  onClick,
  disabled,
  dataActionId,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      'tw-text-base tw-text-primary tw-font-medium tw-w-full tw-mt-0 tw-h-10 tw-rounded-xl tw-p-2.5 tw-normal-case tw-leading-none tw-bg-primary-10 hover:tw-bg-primary-25 tw-bg-opacity-10 hover:tw-bg-opacity-0 tw-border tw-border-primary tw-transition-all',
      {
        'tw-opacity-25 tw-cursor-not-allowed hover:tw-bg-transparent': disabled,
      },
    )}
    data-action-id={dataActionId}
  >
    {text}
  </button>
);
