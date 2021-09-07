import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

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
  <button
    type="button"
    className={classNames(
      'btn',
      styles['tab-button'],
      active && styles['tab-button--active'],
    )}
    onClick={onClick}
    disabled={isDisabled}
  >
    <div className="tw-font-extralight">{text}</div>
    <div className="tw-text-2xl tw-font-semibold">{amount}</div>
  </button>
);
