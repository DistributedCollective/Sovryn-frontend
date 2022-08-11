import React, { useCallback } from 'react';
import classNames from 'classnames';

type SelectBoxProps = {
  onClick?: Function;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export const SelectBox: React.FC<SelectBoxProps> = ({
  onClick,
  disabled,
  children,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  return (
    <div
      onClick={handleClick}
      className={classNames(
        'tw-w-32 tw-h-32 tw-bg-gray-4 tw-rounded-lg tw-py-4 tw-text-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-transition tw-duration-700 tw-ease-in-out tw-mx-5',
        { 'tw-opacity-25': disabled, 'hover:tw-bg-gray-5': !disabled },
        className,
        disabled ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer',
      )}
    >
      {children}
    </div>
  );
};
