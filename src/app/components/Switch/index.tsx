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
}) => {
  const isRightAligned = useMemo(() => alignment === SwitchAlignment.RIGHT, [
    alignment,
  ]);

  return (
    <div
      className={classNames(className, styles.switch, {
        'tw-inline-flex': inline,
      })}
    >
      <label
        className={classNames(
          { 'tw-cursor-not-allowed tw-opacity-50': disabled },
          { 'tw-flex-row-reverse': isRightAligned },
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        <div
          className={classNames(styles.indicator, {
            'tw-ml-2.5': isRightAligned,
          })}
        >
          {innerLabelChecked && <div>{innerLabelChecked}</div>}
          {innerLabel && <div>{innerLabel}</div>}
        </div>
        <p>{label}</p>
      </label>
    </div>
  );
};
