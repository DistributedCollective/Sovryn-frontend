/**
 *
 * LoanTokenGraphs
 *
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { curveNatural } from '@visx/curve';
import { scaleBand, scaleLinear } from '@visx/scale';
import LinePath from '@visx/shape/lib/shapes/LinePath';
import { Text } from '@visx/text/lib/index';
import useTooltipInPortal from '@visx/tooltip/lib/hooks/useTooltipInPortal';
import useTooltip from '@visx/tooltip/lib/hooks/useTooltip';
// import styled from 'styled-components/macro';
import { LendingPool } from 'utils/models/lending-pool';
import { Asset } from '../../../types/asset';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { databaseRpcNodes } from '../../../utils/classifiers';
import { getLendingContract } from '../../../utils/blockchain/contract-helpers';

interface DataItem {
  date: Date;
  supply_apr: number;
  supply: number;
}

// @ts-ignore
const getIndex = (d: DataItem, data: DataItem[]) => data.indexOf(d);
const getApr = (d: DataItem) => d.supply_apr;
const getSupply = (d: DataItem) => d.supply;

interface Props {
  lendingPool: LendingPool;
}

export function LoanTokenGraphs(props: Props) {
  const { chainId } = useSelector(selectWalletProvider);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(databaseRpcNodes[chainId], {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'custom_getLoanTokenHistory',
        params: [
          {
            address: getLendingContract(props.lendingPool.getAsset()).address,
          },
        ],
      }),
    })
      .then(e => e.json().then())
      .then(e => {
        setData(e);
      })
      .catch(console.error);
  }, [chainId, props.lendingPool]);

  if (!data.length) {
    return null;
  }

  return (
    <ParentSize>
      {({ width }) => (
        <BarsGraph
          width={width}
          asset={props.lendingPool.getAsset()}
          data={data}
        />
      )}
    </ParentSize>
  );
}

interface BarsProps {
  width: number;
  asset: Asset;
  data: DataItem[];
}

function BarsGraph({ width, asset, data }: BarsProps) {
  const [activeStep, setActiveStap] = useState<number>(null as any);

  const height = 115;

  // bounds
  const xSupplyMax = width;
  const ySupplyMax = 60;

  const xAPRMax = width;
  const yAPRMax = 23;

  // scales, memoize for performance
  const xAPRScale = useMemo(
    () =>
      scaleBand<number>({
        range: [0, xAPRMax],
        round: true,
        domain: data.map(d => getIndex(d, data)),
        padding: 0.4,
      }),
    [xAPRMax, data],
  );
  const yAPRScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yAPRMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getApr))],
      }),
    [yAPRMax, data],
  );
  const xSupplyScale = useMemo(
    () =>
      scaleBand<number>({
        range: [0, xSupplyMax],
        round: true,
        domain: data.map(d => getIndex(d, data)),
        padding: 0.4,
      }),
    [xSupplyMax, data],
  );
  const ySupplyScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [ySupplyMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getSupply))],
      }),
    [ySupplyMax, data],
  );

  const { containerRef, containerBounds } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const {
    showTooltip,
    hideTooltip,
    // tooltipOpen,
    // tooltipLeft = 0,
    // tooltipTop = 0,
  } = useTooltip<string>({
    // initial tooltip state
    tooltipOpen: false,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: 'Move me with your mouse or finger',
  });

  // event handlers
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX =
        ('clientX' in event ? event.clientX : 0) - containerBounds.left;
      showTooltip({
        tooltipLeft: containerX,
        tooltipData: 'sup',
      });
    },
    [showTooltip, containerBounds],
  );

  const handlePointerLeave = useCallback(() => {
    hideTooltip();
    setActiveStap(null as any);
  }, [hideTooltip]);

  // @ts-ignore
  // @ts-ignore
  return width < 10 ? null : (
    <div
      className="position-relative"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ width, height }}
    >
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={'#171717'} rx={14} />
        <Group top={5} left={xSupplyScale.bandwidth() / 2}>
          <LinePath
            data={data}
            curve={curveNatural}
            x={d => xAPRScale(getIndex(d, data)) ?? 0}
            y={d => yAPRScale(getApr(d)) ?? 0}
            stroke="#f89b2b"
            strokeDasharray="5, 5"
            shapeRendering="geometricPrecision"
            markerMid="url(#marker-circle)"
          />
          {activeStep !== null && (
            <circle
              key={getIndex(data[activeStep], data)}
              r={4}
              cx={xAPRScale(getIndex(data[activeStep], data))}
              cy={yAPRScale(getApr(data[activeStep]))}
              stroke="#f89b2b"
              strokeWidth={2}
              fill="#ffffff"
            />
          )}
        </Group>
        <Group top={33} left={xSupplyScale.bandwidth() / 2}>
          <Text verticalAnchor="start" fill="#f89b2b" fontSize={10}>
            % Interest APR
          </Text>
        </Group>
        <Group top={50} left={xSupplyScale.bandwidth() / 2}>
          {data.map(d => {
            const letter = getIndex(d, data);
            const barWidth = xSupplyScale.bandwidth();
            const barHeight = ySupplyMax - (ySupplyScale(getSupply(d)) ?? 0);
            const barX = (xSupplyScale(letter) || 0) - barWidth / 2;
            const barY = ySupplyMax - barHeight;
            return (
              <Bar
                key={`bar-${letter}`}
                x={barX}
                y={barY}
                rx={5}
                ry={5}
                width={barWidth}
                height={barHeight}
                fill={activeStep === letter ? '#f89b2b' : '#333333'}
              />
            );
          })}
        </Group>
      </svg>
      {/*{tooltipOpen && (*/}
      {/*  <TooltipComponent*/}
      {/*    top={tooltipTop}*/}
      {/*    left={tooltipLeft}*/}
      {/*    asset={asset}*/}
      {/*    supply_apr={2}*/}
      {/*    supply={2}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
}

// interface TooltipProps {
//   left: number;
//   top: number;
//   asset: Asset;
//   supply_apr: number;
//   supply: number;
// }
//
// function TooltipComponent({
//   top,
//   left,
//   asset,
//   supply_apr,
//   supply,
// }: TooltipProps) {
//   return (
//     <TooltipIndicator
//       style={{
//         transform: `translate(${left}px, ${top}px)`,
//       }}
//     >
//       <TooltipContainer>
//         <AprTooltip style={{ top: '-20px' }}>
//           <AprTooltipValue>{supply_apr.toLocaleString()}%</AprTooltipValue>
//           <AprTooltipTitle>Interest APR</AprTooltipTitle>
//         </AprTooltip>
//         <SupplyTooltip style={{ top: '45px' }}>
//           <SupplyTooltipValue>
//             {asset} {supply.toLocaleString()}
//           </SupplyTooltipValue>
//           <SupplyTooltipTitle>Supply</SupplyTooltipTitle>
//         </SupplyTooltip>
//       </TooltipContainer>
//     </TooltipIndicator>
//   );
// }
//
// const TooltipIndicator = styled.div`
//   position: absolute;
//   width: 1px;
//   border-right: 1px dashed #333;
//   top: 0;
//   bottom: 0;
// `;
//
// const TooltipContainer = styled.div`
//   text-align: center;
//   transform: translateX(-50%);
//   width: 100px;
// `;
//
// const SupplyTooltip = styled.div`
//   position: relative;
//   top: 10px;
//   position: absolute;
//   left: 0;
//   width: 100px;
// `;
// const SupplyTooltipTitle = styled.div`
//   font-weight: 300;
//   color: #fff;
//   font-size: 9px;
// `;
// const SupplyTooltipValue = styled.div`
//   font-weight: 700;
//   color: #f89b2b;
//   font-size: 12px;
// `;
//
// const AprTooltip = styled.div`
//   position: relative;
//   top: 10px;
//   position: absolute;
//   left: 0;
//   width: 100px;
// `;
// const AprTooltipTitle = styled.div`
//   font-weight: 300;
//   color: #fff;
//   font-size: 9px;
// `;
// const AprTooltipValue = styled.div`
//   font-weight: 700;
//   color: #fff;
//   font-size: 12px;
// `;
