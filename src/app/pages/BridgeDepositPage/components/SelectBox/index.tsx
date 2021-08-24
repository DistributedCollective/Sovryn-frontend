import React, { useCallback } from 'react';
import cn from 'classnames';

import { Item } from './styled';

type Props = {
  onClick?: Function;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};
export function SelectBox({ onClick, disabled, children, className }: Props) {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  return (
    <Item
      onClick={handleClick}
      className={cn(
        'tw-py-4 tw-text-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer tw-transition tw-duration-700 tw-ease-in-out tw-mx-5',
        { 'tw-opacity-25': disabled },
        className,
      )}
      disabled={disabled}
    >
      {children}
    </Item>
  );
}
