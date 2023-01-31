import classNames from 'classnames';
import React from 'react';
import { Button, ButtonSize, ButtonColor } from '../../../components/Button';

type FastBtcButtonProps = {
  text: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export const FastBtcButton: React.FC<FastBtcButtonProps> = ({
  text,
  onClick,
  disabled,
  loading,
  className,
}) => {
  return (
    <Button
      className={classNames(
        'tw-max-w-xs tw-font-semibold tw-whitespace-nowrap',
        className,
      )}
      size={ButtonSize.sm}
      text={text}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      color={ButtonColor.gray}
    />
  );
};
