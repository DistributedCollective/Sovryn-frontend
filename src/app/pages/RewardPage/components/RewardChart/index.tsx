import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsBoost from 'highcharts/modules/boost';
/**
 *
 * ComparisonChart
 *
 */
import React, { useEffect, useState } from 'react';

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
    if (item.legendLine) {
      item.legendLine.attr({ stroke: item.color });
    }
    if (item.legendSymbol) {
      if (item.options && item.options.marker && item.legendSymbol.isMarker)
        item.legendSymbol.attr(item.pointAttribs());
      else item.legendSymbol.attr({ fill: item.color });
    }
  });
})(Highcharts);

interface ComparisonProps {
  height: number;
  // datasetPrimary: Highcharts.SeriesOptionsType;
  title?: string;
  className?: string;
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction;
}

export default function RewardChart({
  height,
  title,
  className,
  tooltipFormatter,
}: ComparisonProps) {
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'pie',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: title,
    },
    series: [
      // {
      //   size: '60%',
      //   color: '#FFAC3E',
      //   data: [50, 25, 25],
      // },
    ],
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
      },
    },
    legend: {
      y: 18,
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#EDEDED',
        opacity: 1,
      },
      itemHoverStyle: {
        color: '#BDBDBD',
        opacity: 1,
      },
      itemHiddenStyle: {
        opacity: 0.5,
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: undefined,
      },
      labels: {
        style: {
          color: '#EDEDED',
        },
      },
    },
    yAxis: {
      title: {
        text: undefined,
      },
      labels: {
        x: -5,
        formatter: function () {
          var label = this.axis.defaultLabelFormatter.call(this);

          // Use thousands separator for four-digit numbers too
          if (/^[0-9]{4}$/.test(label)) {
            return Highcharts.numberFormat(Number(this.value), 0);
          }
          return label + '%';
        },
        style: {
          color: '#EDEDED',
        },
      },
      gridLineColor: 'rgba(233, 234, 233, 0.25)',
      showLastLabel: false,
    },
    tooltip: {
      shared: true,
      formatter: tooltipFormatter,
    },
  });

  useEffect(() => {
    setOptions(options => ({
      ...options,
      title: {
        text: title,
      },
    }));
  }, [setOptions, title]);

  useEffect(() => {
    setOptions(options => ({
      ...options,
      chart: {
        ...options.chart,
        height: height,
      },
    }));
  }, [setOptions, height]);

  return (
    <div className={className}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
