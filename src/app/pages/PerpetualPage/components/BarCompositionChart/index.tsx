import classNames from 'classnames';
import React, { useMemo } from 'react';

export type BarCompositionChartEntry = {
  key: string;
  label?: React.ReactNode;
  value: number;
  valueLabel?: React.ReactNode;
  barClassName?: string;
  color?: string;
  colorClassName?: string;
};

type BarCompositionChartProps = {
  className?: string;
  totalLabel?: React.ReactNode;
  totalValueLabel?: React.ReactNode;
  entries: BarCompositionChartEntry[];
};

export const BarCompositionChart: React.FC<BarCompositionChartProps> = ({
  className,
  totalLabel,
  totalValueLabel,
  entries,
}) => {
  const total = useMemo(
    () => entries.reduce((acc, entry) => acc + (entry?.value || 0), 0),
    [entries],
  );

  return (
    <div className={className}>
      {totalLabel && totalValueLabel && (
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-mb-12 tw-text-xl tw-font-medium">
          <div className="tw-mr-2 tw-font-semibold">{totalLabel}</div>
          <div>{totalValueLabel}</div>
        </div>
      )}
      <div className="tw-flex tw-flex-row tw-space-x-0.5 tw-mb-12">
        {entries.map(entry => (
          <BarSegment {...entry} total={total} />
        ))}
      </div>
      <div className="tw-flex tw-flex-row tw-justify-between tw-flex-wrap">
        {entries.map(entry => (
          <BarLabel {...entry} />
        ))}
      </div>
    </div>
  );
};

type BarSegmentProps = BarCompositionChartEntry & { total: number };

const BarSegment: React.FC<BarSegmentProps> = ({
  value,
  barClassName,
  color,
  colorClassName,
  total,
}) => {
  const style = useMemo(
    () => ({
      width: (value / total) * 100 + '%',
      backgroundColor: color,
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
    />
  );
};

const BarLabel: React.FC<BarCompositionChartEntry> = ({
  label,
  value,
  valueLabel,
  color,
  colorClassName,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className="tw-flex tw-flex-row tw-min-w-max tw-mb-2">
      <div
        className={classNames(
          'tw-flex-none tw-w-3.5 tw-h-3.5 tw-mr-2',
          colorClassName,
        )}
        style={{
          backgroundColor: color,
        }}
      />
      <div className="tw-flex tw-flex-col tw-mr-4">
        <div className="tw-text-xs tw-leading-tight tw-mb-2">{label}</div>
        <div className="tw-text-lg tw-font-medium">{valueLabel}</div>
      </div>
    </div>
  );
};
