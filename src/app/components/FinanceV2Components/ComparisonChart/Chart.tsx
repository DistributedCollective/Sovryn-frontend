import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import * as Highcharts from 'highcharts';
import highchartsBoost from 'highcharts/modules/boost';
import HighchartsReact from 'highcharts-react-official';

highchartsBoost(Highcharts);

// Override to prevent hidden legend items from removing color key
(function (H) {
  H.wrap(H.Legend.prototype, 'colorizeItem', function (
    this: any,
    proceed,
    item,
    visible,
  ) {
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    if (item.legendLine) item.legendLine.attr({ stroke: item.color });
    if (item.legendSymbol) {
      if (item.options && item.options.marker && item.legendSymbol.isMarker)
        item.legendSymbol.attr(item.pointAttribs());
      else item.legendSymbol.attr({ fill: item.color });
    }
  });
})(Highcharts);

export interface YAxisProps {
  suffix?: string;
  color?: string;
  x?: number;
  formatter?: Highcharts.AxisLabelsFormatterCallbackFunction;
}

export interface XAxisProps {
  y?: number;
  title?: string;
}

export interface LegendProps {
  labelColor?: string;
  labelOpacity?: number;
  labelHoverColor?: string;
  labelHoverOpacity?: number;
  labelHiddenOpacity?: number;
  y?: number;
}

export interface ChartProps {
  height?: number;
  width?: number;
  margin?: [number, number, number, number];
  backgroundColor?: string;
  labelColor?: string;
  legendProps?: LegendProps;
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
  secondaryYAxisProps?: YAxisProps;
  datasetPrimary: Highcharts.SeriesOptionsType;
  datasetSecondary?: Highcharts.SeriesOptionsType;
  datasetTotal?: Highcharts.SeriesOptionsType;
  title?: string;
  className?: string;
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction;
}

export default function Chart(props: ChartProps) {
  // All Highcharts settings here: https://api.highcharts.com/highcharts
  const [options, setOptions] = useState<Highcharts.Options>({
    credits: {
      enabled: false,
    },
    title: {
      text: props.title,
    },
    series: [
      props.datasetPrimary,
      ...(props.datasetSecondary ? [props.datasetSecondary] : []),
      ...(props.datasetTotal ? [props.datasetTotal] : []),
    ],
    plotOptions: {
      areaspline: {
        fillOpacity: 0,
        marker: {
          enabled: false,
        },
      },
    },
    chart: {
      height: props.height,
      width: props.width,
      backgroundColor: props.backgroundColor || '#2D2D2D',
      margin: props.margin || [30, 40, 30, 40],
    },
    legend: {
      y: props.legendProps?.y || -8,
      align: 'center',
      verticalAlign: 'top',
      itemStyle: {
        color: props.legendProps?.labelColor || '#EDEDED',
        fontWeight: 'normal',
        opacity:
          props.legendProps?.hasOwnProperty('labelOpacity') &&
          props.legendProps?.labelOpacity !== null
            ? props.legendProps?.labelOpacity
            : 1,
      },
      itemHoverStyle: {
        color: props.legendProps?.labelHoverColor || '#BDBDBD',
        fontWeight: 'normal',
        opacity:
          props.legendProps?.hasOwnProperty('labelHoverOpacity') &&
          props.legendProps?.labelHoverOpacity !== null
            ? props.legendProps?.labelHoverOpacity
            : 1,
      },
      itemHiddenStyle: {
        fontWeight: 'normal',
        opacity:
          props.legendProps?.hasOwnProperty('labelHiddenOpacity') &&
          props.legendProps?.labelHiddenOpacity !== null
            ? props.legendProps?.labelHiddenOpacity
            : 0.4,
      },
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 70,
      title: {
        text: props.xAxisProps?.title || undefined,
      },
      labels: {
        y: props.xAxisProps?.y || 25,
        style: {
          color: props.labelColor || '#EDEDED',
          textOverflow: 'none',
          whiteSpace: 'nowrap',
        },
      },
    },
    yAxis: [
      {
        title: {
          text: undefined,
        },
        labels: {
          x: props.yAxisProps?.x || 10,
          format: `{value}${props.yAxisProps?.suffix}`,
          style: {
            color: props.labelColor || '#EDEDED',
            textOverflow: 'none',
            whiteSpace: 'nowrap',
          },
        },
        gridLineColor: 'rgba(233, 234, 233, 0.25)',
      },
      ...(props.datasetTotal
        ? [
            {
              title: {
                text: undefined,
              },
              labels: {
                x: props.secondaryYAxisProps?.x || 5,
                format: `{value}${props.secondaryYAxisProps?.suffix}`,
                formatter: props.secondaryYAxisProps?.formatter, //overrides 'format' if present
                style: {
                  color: props.labelColor || '#EDEDED',
                  textOverflow: 'none',
                  whiteSpace: 'nowrap',
                },
              },
              opposite: true,
            },
          ]
        : []),
    ],
    tooltip: {
      shared: true,
      backgroundColor: 'rgb(233, 234, 233, .75)',
      borderWidth: 0,
      borderRadius: 15,
      formatter: props.tooltipFormatter,
    },
    responsive: {
      rules: [
        //legend styles
        {
          condition: {
            minWidth: 100,
            maxWidth: 300,
          },
          chartOptions: {
            legend: {
              itemWidth: 80,
              symbolPadding: 0,
            },
          },
        },
        {
          condition: {
            minWidth: 300,
            maxWidth: 400,
          },
          chartOptions: {
            legend: {
              itemWidth: 110,
              symbolPadding: 0,
            },
          },
        },
        //others
        {
          condition: {
            minWidth: 100,
            maxWidth: 400,
          },
          chartOptions: {
            yAxis: [
              {
                labels: {
                  align: 'right',
                  x: -2,
                },
              },
              {
                labels: {
                  align: 'left',
                  x: 2,
                },
              },
            ],
          },
        },
        {
          condition: {
            minWidth: 400,
            maxWidth: 600,
          },
          chartOptions: {
            yAxis: [
              {
                labels: {
                  align: 'right',
                  x: -5,
                },
              },
              {
                labels: {
                  align: 'left',
                },
              },
            ],
          },
        },
        {
          condition: {
            minWidth: 600,
          },
          chartOptions: {
            chart: {
              margin: [30, 50, 30, 50],
            },
            yAxis: [
              {
                labels: {
                  align: 'right',
                  x: -5,
                },
              },
              {
                labels: {
                  align: 'left',
                },
              },
            ],
          },
        },
      ],
    },
  });

  useEffect(() => {
    setOptions(options => ({
      ...options,
      title: {
        text: props.title,
      },
    }));
  }, [props.title]);

  useEffect(() => {
    setOptions(options => ({
      ...options,
      chart: {
        ...options.chart,
        height: props.height,
      },
    }));
  }, [props.height]);

  useEffect(() => {
    setOptions(options => ({
      ...options,
      chart: {
        ...options.chart,
        width: props.width,
      },
    }));
  }, [props.width]);

  return (
    <div className={classnames(props.className)}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
