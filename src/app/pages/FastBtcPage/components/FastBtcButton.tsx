import React from 'react';
import { Button, ButtonStyle, ButtonSize } from '../../../components/Button';

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
      style={ButtonStyle.frosted}
      size={ButtonSize.lg}
      text={text}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    />
  );
};
