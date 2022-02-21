import React, { useMemo } from 'react';
import classNames from 'classnames';
import * as Highcharts from 'highcharts';
import highchartsBoost from 'highcharts/modules/boost';
import HighchartsReact from 'highcharts-react-official';

highchartsBoost(Highcharts);

// May be used with the inception of limit orders.

// TODO: Implement API call and fetch asks and bids dynamically

const asks = [
  [0.1435, 242.521842],
  [0.1436, 206.49862099999999],
  [0.1437, 205.823735],
  [0.1438, 197.33275],
  [0.1439, 153.677454],
  [0.144, 146.007722],
  [0.1442, 82.55212900000001],
  [0.1443, 59.152814000000006],
  [0.1444, 57.942260000000005],
  [0.1445, 57.483850000000004],
  [0.1446, 52.39210800000001],
  [0.1447, 51.867208000000005],
  [0.1448, 44.104697],
  [0.1449, 40.131217],
  [0.145, 31.878217],
  [0.1451, 22.794916999999998],
  [0.1453, 12.345828999999998],
  [0.1454, 10.035642],
  [0.148, 9.326642],
  [0.1522, 3.76317],
];
const bids = [
  [0.1524, 0.948665],
  [0.1539, 35.510715],
  [0.154, 39.883437],
  [0.1541, 40.499661],
  [0.1545, 43.262994000000006],
  [0.1547, 60.14799400000001],
  [0.1553, 60.30799400000001],
  [0.1558, 60.55018100000001],
  [0.1564, 68.381696],
  [0.1567, 69.46518400000001],
  [0.1569, 69.621464],
  [0.157, 70.398015],
  [0.1574, 70.400197],
  [0.1575, 73.199217],
  [0.158, 77.700017],
  [0.1583, 79.449017],
  [0.1588, 79.584064],
  [0.159, 80.584064],
  [0.16, 81.58156],
  [0.1608, 83.38156],
];

type DepthChartProps = {
  className?: string;
};

export const DepthChart: React.FC<DepthChartProps> = ({ className }) => {
  const options = useMemo(
    () => ({
      chart: {
        type: 'area',
        zoomType: 'xy',
        height: 163,
        backgroundColor: 'transparent',
        style: {
          maxWidth: '97%',
        },
      },
      credits: {
        enabled: false,
      },
      title: {
        text: null,
      },
      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [
          {
            color: '#888',
            value: 0.1523,
            width: 1,
          },
        ],
        labels: {
          style: {
            color: 'white',
          },
        },
        title: {
          text: 'Price',
          style: {
            color: 'white',
          },
        },
      },
      yAxis: [
        {
          tickAmount: 6,
          lineWidth: 1,
          gridLineWidth: 1,
          gridLineColor: '#484848',
          title: null,
          tickWidth: 1,
          tickLength: 5,
          labels: {
            style: {
              color: 'white',
            },
          },
        },
        {
          opposite: true,
          linkedTo: 0,
          lineWidth: 1,
          gridLineWidth: 0,
          title: null,
          tickWidth: 1,
          tickLength: 5,
          labels: {
            style: {
              color: 'white',
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.3,
          lineWidth: 1,
          step: 'center',
        },
      },
      tooltip: {
        headerFormat:
          '<span style="font-size=10px;">Price: {point.key}</span><br/>',
        valueDecimals: 2,
      },
      series: [
        {
          name: 'Bids',
          data: bids,
          color: '#17C3B2',
        },
        {
          name: 'Asks',
          data: asks,
          color: '#CE4B09',
        },
      ],
    }),
    [],
  );

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-col tw-flex-1 tw-min-w-min tw-px-4 tw-pt-1.5 tw-bg-black tw-rounded-xl tw-w-full',
        className,
      )}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
