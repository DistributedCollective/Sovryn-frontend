import React from 'react';
import classNames from 'classnames';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
}

interface Props extends BtnProps {
  text: React.ReactNode;
  className?: string;
  dataActionId?: string;
}

export function CloseButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={classNames(
        props.className,
        'tw-w-full tw-bg-primary tw-font-normal tw-bg-opacity-0 tw-hover:text-primary tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-2 tw-text-lg tw-text-primary tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl hover:tw-no-underline tw-no-underline',
      )}
      data-action-id={props.dataActionId}
    >
      {props.text}
    </button>
  );
}
