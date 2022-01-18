import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type LeverageViewerProps = {
  className?: string;
  min: number;
  max: number;
  value: number;
  valueLabel: React.ReactNode;
  label: React.ReactNode;
};

export const LeverageViewer: React.FC<LeverageViewerProps> = ({
  className,
  min,
  max,
  value,
  valueLabel,
  label,
}) => {
  const [preStyle, postStyle] = useMemo(() => {
    const clampedValue = Math.max(min, Math.min(max, value));
    const width = ((clampedValue - min) / (max - min)) * 100;

    return [{ width: `${width}%` }, { width: `${100 - width}%` }];
  }, [value, min, max]);

  return (
    <div
      className={classNames(
        'tw-flex tw-text-xs tw-font-medium tw-leading-relaxed tw-justify-between',
        className,
      )}
    >
      <label className="tw-mr-4">{label}</label>
      <div className={styles.slider}>
        <div className="tw-flex-auto tw-min-w-2.5" style={preStyle} />
        <div className="tw-flex-none tw-px-2 tw-text-black tw-bg-white">
          {valueLabel}
        </div>
        <div
          className="tw-flex-auto tw-min-w-2.5 tw-bg-gray-2 tw-opacity-75"
          style={postStyle}
        />
      </div>
    </div>
  );
};
