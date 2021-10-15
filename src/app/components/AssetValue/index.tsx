import { Tooltip } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { Asset } from '../../../types';
import { numberFromWei } from '../../../utils/blockchain/math-helpers';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';
import { AssetDecimals, AssetValueMode } from './types';

type AssetValueProps = {
  value: number | string;
  asset?: Asset;
  useTooltip?: boolean;
  mode?: AssetValueMode;
  minDecimals?: number;
  maxDecimals?: number;
  className?: string;
  isApproximation?: boolean;
};

export const AssetValue: React.FC<AssetValueProps> = ({
  value,
  asset,
  mode = AssetValueMode.defined,
  useTooltip = false,
  minDecimals = 0,
  maxDecimals = 6,
  className,
  isApproximation = false,
}) => {
  const [formattedValue, fullFormattedValue] = useMemo(() => {
    if (!value && value !== 0) {
      return [];
    }

    let min = minDecimals;
    let max = maxDecimals;
    if (mode === AssetValueMode.defined) {
      min = (asset && AssetDecimals[asset]) || 2;
      max = min;
    }

    const numberValue =
      typeof value === 'string' ? numberFromWei(value) : value;

    return [
      numberValue.toLocaleString(navigator.language, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      }),
      numberValue.toLocaleString(navigator.language, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
    ];
  }, [value, minDecimals, maxDecimals, mode, asset]);

  if (!formattedValue) {
    return null;
  }

  const assetValue = (
    <span className={className}>
      {isApproximation && '≈ '}
      {formattedValue}
      {asset && (
        <>
          {' '}
          <AssetSymbolRenderer asset={asset} />
        </>
      )}
    </span>
  );

  if (useTooltip) {
    return (
      <Tooltip
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        interactionKind="hover"
        content={
          <>
            {isApproximation && '≈ '}
            {fullFormattedValue}
            {asset && (
              <>
                {' '}
                <AssetSymbolRenderer asset={asset} />
              </>
            )}
          </>
        }
      >
        {assetValue}
      </Tooltip>
    );
  }

  return assetValue;
};
