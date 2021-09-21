import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import * as Highcharts from 'highcharts';
import highchartsBoost from 'highcharts/modules/boost';
import HighchartsReact from 'highcharts-react-official';

highchartsBoost(Highcharts);

// (function (H) {
//   H.wrap(H.Series.prototype, 'translate', function (proceed) {
//     const options = this.options;

//     const topMargin = options.topMargin || 0;
//     const bottomMargin = options.bottomMargin || 0;

//     proceed.call(this);

//     this.points.forEach(function (point) {
//       if (
//         options.borderRadiusTopLeft ||
//         options.borderRadiusTopRight ||
//         options.borderRadiusBottomRight ||
//         options.borderRadiusBottomLeft
//       ) {
//         const w = point.shapeArgs.width;
//         const h = point.shapeArgs.height;
//         const x = point.shapeArgs.x;
//         const y = point.shapeArgs.y;

//         var radiusTopLeft = H.relativeLength(
//           options.borderRadiusTopLeft || 0,
//           w,
//         );
//         var radiusTopRight = H.relativeLength(
//           options.borderRadiusTopRight || 0,
//           w,
//         );
//         var radiusBottomRight = H.relativeLength(
//           options.borderRadiusBottomRight || 0,
//           w,
//         );
//         var radiusBottomLeft = H.relativeLength(
//           options.borderRadiusBottomLeft || 0,
//           w,
//         );

//         const maxR = Math.min(w, h) / 2;

//         radiusTopLeft = radiusTopLeft > maxR ? maxR : radiusTopLeft;
//         radiusTopRight = radiusTopRight > maxR ? maxR : radiusTopRight;
//         radiusBottomRight = radiusBottomRight > maxR ? maxR : radiusBottomRight;
//         radiusBottomLeft = radiusBottomLeft > maxR ? maxR : radiusBottomLeft;

//         point.dlBox = point.shapeArgs;

//         point.shapeType = 'path';
//         point.shapeArgs = {
//           d: [
//             'M',
//             x + radiusTopLeft,
//             y + topMargin,
//             'L',
//             x + w - radiusTopRight,
//             y + topMargin,
//             'C',
//             x + w - radiusTopRight / 2,
//             y,
//             x + w,
//             y + radiusTopRight / 2,
//             x + w,
//             y + radiusTopRight,
//             'L',
//             x + w,
//             y + h - radiusBottomRight,
//             'C',
//             x + w,
//             y + h - radiusBottomRight / 2,
//             x + w - radiusBottomRight / 2,
//             y + h,
//             x + w - radiusBottomRight,
//             y + h + bottomMargin,
//             'L',
//             x + radiusBottomLeft,
//             y + h + bottomMargin,
//             'C',
//             x + radiusBottomLeft / 2,
//             y + h,
//             x,
//             y + h - radiusBottomLeft / 2,
//             x,
//             y + h - radiusBottomLeft,
//             'L',
//             x,
//             y + radiusTopLeft,
//             'C',
//             x,
//             y + radiusTopLeft / 2,
//             x + radiusTopLeft / 2,
//             y,
//             x + radiusTopLeft,
//             y,
//             'Z',
//           ],
//         };
//       }
//     });
//   });
// })(Highcharts);

type IDepthChartProps = {
  className?: String;
};

const options = {
  chart: {
    zoomType: 'x',
    type: 'column',
    backgroundColor: 'transparent',
  },
  title: {
    text: null,
  },
  xAxis: {
    lineWidth: 0,
    gridLineWidth: 0,
    title: null,
    tickLength: 0,
    maxPadding: 0,
    labels: {
      style: {
        color: 'white',
      },
    },
  },
  yAxis: {
    lineWidth: 0,
    gridLineWidth: 0,
    title: null,
    labels: {
      align: 'right',
      style: {
        color: 'white',
      },
    },
    max: 500000,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    headerFormat:
      '<span style="font-size=10px;">Price: {point.key}</span><br/>',
    valueDecimals: 2,
  },
  plotOptions: {
    column: {
      borderRadius: 8,
      shadow: true,
      groupPadding: 0,
      pointPlacement: 'between',
      pointRange: 20,
      pointWidth: 20,
      opacity: 0.75,
      // borderRadiusTopLeft: 5,
      // borderRadiusTopRight: 5,
    },
  },
  series: [
    {
      name: 'Bids',
      data: [
        [40000, 500000],
        [41000, 400000],
        [42000, 300000],
        [43000, 330000],
        [44000, 250000],
        [45000, 200000],
        [46000, 150000],
        [47000, 130000],
      ],
      color: '#17C3B2',
      borderColor: '#17C3B2',
      borderRadius: 4,
    },

    {
      name: 'Asks',
      data: [
        [48000, 130000],
        [49000, 150000],
        [50000, 200000],
        [51000, 250000],
        [52000, 330000],
        [53000, 300000],
        [54000, 400000],
        [55000, 500000],
      ],
      color: '#CE4B09',
      borderColor: '#CE4B09',
      borderRadius: 4,
    },
  ],
};
export const DepthChart: React.FC<IDepthChartProps> = ({ className }) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-flex-1 tw-min-w-min tw-px-4 tw-pt-1.5 tw-pb-4 tw-bg-black tw-rounded-xl',
      className,
    )}
  >
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);
