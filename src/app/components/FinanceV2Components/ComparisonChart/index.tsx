import React from 'react';
import classNames from 'classnames';

import Chart, { ChartProps } from './Chart';
import { abbreviateNumber } from 'utils/helpers';

export interface Dataset {
  data: [number, number][]; //[timeInMs, value]
  name: string;
  color: string;
  numDecimals?: number;
  suffix?: string;
  formatter?: () => string;
}

export interface ComparisonProps {
  primaryData: Dataset;
  secondaryData?: Dataset;
  totalData?: Dataset;
  className?: string;
  margin?: [number, number, number, number];
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction;
}

export default function ComparisonChart(props: ComparisonProps) {
  const options: ChartProps = {
    height: 150,
    margin: props.margin || [30, 45, 30, 45],
    labelColor: '#EDEDED',
    tooltipFormatter: props.tooltipFormatter,
    yAxisProps: {
      suffix: '%',
    },
    secondaryYAxisProps: {
      formatter: function (this: any) {
        return `${abbreviateNumber(this.value)} ${
          props.totalData?.suffix || ''
        }`;
      },
    },
    datasetPrimary: {
      type: 'areaspline',
      name: props.primaryData.name,
      color: props.primaryData.color,
      data: props.primaryData.data,
      tooltip: {
        valueDecimals: props.primaryData.numDecimals || 2,
        valueSuffix: props.primaryData.suffix || '%',
      },
      yAxis: 0,
    },
    datasetSecondary: props.secondaryData
      ? {
          type: 'areaspline',
          name: props.secondaryData.name,
          color: props.secondaryData.color,
          data: props.secondaryData.data,
          tooltip: {
            valueDecimals: props.secondaryData.numDecimals || 2,
            valueSuffix: props.secondaryData.suffix || '%',
          },
          yAxis: 0,
        }
      : undefined,
    datasetTotal: props.totalData
      ? {
          type: 'areaspline',
          name: props.totalData.name,
          color: props.totalData.color,
          data: props.totalData.data,
          tooltip: {
            valueDecimals: props.totalData.numDecimals || 2,
            valueSuffix: props.totalData.suffix || '₿',
          },
          yAxis: 1,
        }
      : undefined,
  };
  return (
    <div
      className={classNames(
        'tw-relative tw-rounded-lg tw-overflow-hidden',
        props.className,
      )}
    >
      <Chart {...options} />
    </div>
  );
}
