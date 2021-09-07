import React from 'react';
import { StyledTab } from './styled';

interface ITabProps {
  text: string;
  amount?: string;
  active?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<ITabProps> = ({
  text,
  amount,
  active,
  isDisabled,
  onClick,
}) => (
  <StyledTab
    active={active}
    isDisabled={isDisabled}
    disabled={isDisabled}
    onClick={onClick}
  >
    <div className="tw-font-extralight">{text}</div>
    <div className="tw-text-2xl tw-font-semibold">{amount}</div>
  </StyledTab>
);
