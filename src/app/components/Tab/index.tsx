import React from 'react';
import classNames from 'classnames';

type TabProps = {
  text: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

export const Tab: React.FC<TabProps> = ({
  text,
  active,
  onClick,
  disabled,
  className,
}) => (
  <span
    className={classNames(
      'tw-text-sov-white tw-px-2.5 tw-py-2 tw-text-lg tw-font-thin tw-whitespace-nowrap',
      {
        'tw-text-white tw-font-normal': active,
        'tw-cursor-pointer hover:tw-text-gray-9': !disabled,
        'tw-opacity-50': disabled,
      },
      className,
    )}
    onClick={onClick}
  >
    {text}
  </span>
);
