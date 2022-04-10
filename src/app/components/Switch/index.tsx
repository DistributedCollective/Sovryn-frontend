import React, { ReactNode, useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export enum SwitchAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

interface ISwitchProps {
  className?: string;
  disabled?: boolean;
  onChange: () => void;
  checked: boolean;
  inline?: boolean;
  label: ReactNode;
  alignment?: SwitchAlignment;
  innerLabel?: ReactNode;
  innerLabelChecked?: ReactNode;
  dataActionId?: string;
}

export const Switch: React.FC<ISwitchProps> = ({
  className,
  label,
  alignment = SwitchAlignment.LEFT,
  checked,
  disabled,
  inline,
  onChange,
  innerLabel,
  innerLabelChecked,
  dataActionId,
}) => {
  const isRightAligned = useMemo(() => alignment === SwitchAlignment.RIGHT, [
    alignment,
  ]);

  return (
    <div
      className={classNames(className, {
        'tw-inline-block': inline,
      })}
    >
      <label
        className={classNames(
          styles.switchLabel,
          { 'tw-cursor-not-allowed tw-opacity-50': disabled },
          { 'tw-flex-row-reverse': isRightAligned },
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          data-action-id={dataActionId}
        />
        <span
          className={classNames(styles.indicator, {
            'tw-ml-2.5': isRightAligned,
          })}
        >
          {innerLabelChecked && <span>{innerLabelChecked}</span>}
          {innerLabel && <span>{innerLabel}</span>}
        </span>
        {label}
      </label>
    </div>
  );
};
