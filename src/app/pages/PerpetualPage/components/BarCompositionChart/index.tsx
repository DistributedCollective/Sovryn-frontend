import classNames from 'classnames';
import React, { useMemo } from 'react';

type IBarCompositionChartEntry = {
  key: string;
  label?: React.ReactNode;
  value: number;
  valueLabel?: React.ReactNode;
  barClassName?: string;
  color?: string;
  colorClassName?: string;
};

type IBarCompositionChartProps = {
  className?: string;
  entries: IBarCompositionChartEntry[];
};

export const BarCompositionChart: React.FC<IBarCompositionChartProps> = ({
  className,
  entries,
}) => {
  const total = useMemo(
    () => entries.reduce((acc, entry) => acc + (entry?.value || 0), 0),
    [entries],
  );

  return (
    <div className={className}>
      <div className="tw-flex tw-flex-row tw-space-x-0.5 tw-mb-12">
        {entries.map(entry => (
          <BarSegment {...entry} total={total} />
        ))}
      </div>
      <div className="tw-flex tw-flex-row tw-space-x-2">
        {entries.map(entry => (
          <BarLabel {...entry} />
        ))}
      </div>
    </div>
  );
};

type IBarSegmentProps = IBarCompositionChartEntry & { total: number };

const BarSegment: React.FC<IBarSegmentProps> = ({
  key,
  label,
  value,
  valueLabel,
  barClassName,
  color,
  colorClassName,
  total,
}) => {
  const style = useMemo(
    () => ({
      width: (value / total) * 100 + '%',
      color,
    }),
    [value, total, color],
  );

  if (!value) {
    return null;
  }

  return (
    <div
      className={classNames('tw-h-5', barClassName, colorClassName)}
      style={style}
    ></div>
  );
};

const BarLabel: React.FC<IBarCompositionChartEntry> = ({
  key,
  label,
  value,
  valueLabel,
  barClassName,
  color,
  colorClassName,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="tw-flex tw-flex-row">
      <div
        className={classNames('tw-w-3.5 tw-h-3.5 tw-mr-2', colorClassName)}
        style={{ color }}
      />
      <div className="tw-flex tw-flex-col">
        <div>{label}</div>
        <div>{valueLabel}</div>
      </div>
    </div>
  );
};
