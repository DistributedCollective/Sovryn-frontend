import React from 'react';
import { Button, ButtonSize, ButtonColor } from '../../../components/Button';

type FastBtcButtonProps = {
  text: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const FastBtcButton: React.FC<FastBtcButtonProps> = ({
  text,
  onClick,
  disabled,
  loading,
}) => {
  return (
    <Button
      className="tw-w-full"
      size={ButtonSize.md}
      text={text}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      color={ButtonColor.gray}
    />
  );
};
