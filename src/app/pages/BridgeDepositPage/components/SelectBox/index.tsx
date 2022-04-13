import React, { useCallback } from 'react';
import classNames from 'classnames';

import { Item } from './styled';

type ISelectBoxProps = {
  onClick?: Function;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export const SelectBox: React.FC<ISelectBoxProps> = ({
  onClick,
  disabled,
  children,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  return (
    <>
      <Item
        onClick={handleClick}
        className={classNames(
          'tw-py-4 tw-text-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-transition tw-duration-700 tw-ease-in-out tw-mx-5',
          { 'tw-opacity-25': disabled },
          className,
          disabled ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer',
        )}
        disabled={disabled}
      >
        {children}
      </Item>
    </>
  );
};
