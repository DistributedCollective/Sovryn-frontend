import React from 'react';
import { Text } from '@blueprintjs/core';
import classNames from 'classnames';

interface ITabProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

export const Tab: React.FC<ITabProps> = ({ text, active, onClick }) => {
  return (
    <button
      type="button"
      className={classNames(
        'btn hover:tw-text-gray-9 tw-text-sov-white tw-opacity-25 tw-bg-none tw-text-base tw-normal-case tw-font-semibold tw-mr-2.5 tw-leading-7 tw-py-1.5 tw-px-2.5 hover:tw-opacity-75',
        {
          'tw-opacity-100 hover:tw-opacity-100': active,
        },
      )}
      onClick={onClick}
    >
      <Text ellipsize>{text}</Text>
    </button>
  );
};
