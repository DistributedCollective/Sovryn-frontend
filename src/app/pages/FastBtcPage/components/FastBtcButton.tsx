import React from 'react';
import { Button } from '../../../components/Button';

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
      className="tw-w-full tw-h-14 tw-bg-primary tw-bg-opacity-5 tw-text-primary tw-border-primary tw-border-2 tw-font-semibold hover:tw-bg-opacity-25"
      text={text}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    />
  );
};
