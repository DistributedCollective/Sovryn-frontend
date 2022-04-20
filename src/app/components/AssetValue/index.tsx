import { Tooltip } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { Asset } from '../../../types';
import { numberFromWei } from '../../../utils/blockchain/math-helpers';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';
import { AssetDecimals, AssetValueMode } from './types';

type AssetValueProps = {
  value: number | string;
  asset?: Asset;
  assetString?: string;
  useTooltip?: boolean;
  mode?: AssetValueMode;
  minDecimals?: number;
  maxDecimals?: number;
  className?: string;
  assetClassName?: string;
  isApproximation?: boolean;
  showPositiveSign?: boolean;
};

export const AssetValue: React.FC<AssetValueProps> = ({
  value,
  asset,
  assetString,
  mode = AssetValueMode.predefined,
  useTooltip = false,
  minDecimals = 0,
  maxDecimals = 6,
  className,
  assetClassName,
  isApproximation = false,
  showPositiveSign = false,
}) => {
  const [formattedValue, fullFormattedValue] = useMemo(() => {
    if (!value && value !== 0) {
      return [];
    }

    let min = minDecimals;
    let max = maxDecimals;
    if (mode === AssetValueMode.predefined) {
      min = (asset && AssetDecimals[asset]) || 2;
      max = min;
    }

    const numberValue =
      typeof value === 'string' ? numberFromWei(value) : value;

    return [
      formatNumber(
        numberValue,
        {
          minimumFractionDigits: min,
          maximumFractionDigits: max,
        },
        isApproximation,
        showPositiveSign,
      ),
      formatNumber(
        numberValue,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 18,
        },
        isApproximation,
        showPositiveSign,
      ),
    ];
  }, [
    value,
    minDecimals,
    maxDecimals,
    mode,
    asset,
    isApproximation,
    showPositiveSign,
  ]);

  if (!formattedValue) {
    return null;
  }

  const assetValue = (
    <span className={className}>
      {formattedValue}
      {(asset || assetString) && (
        <>
          {' '}
          <AssetSymbolRenderer
            asset={asset}
            assetString={assetString}
            assetClassName={assetClassName}
          />
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
            {fullFormattedValue}
            {(asset || assetString) && (
              <>
                {' '}
                <AssetSymbolRenderer
                  asset={asset}
                  assetString={assetString}
                  assetClassName={assetClassName}
                />
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

const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions,
  isApproximation: boolean,
  showPositiveSign: boolean,
) => {
  let numberString = value.toLocaleString(navigator.language, options);
  if (showPositiveSign && value > 0) {
    numberString = `+${numberString}`;
  }
  if (isApproximation) {
    numberString = `≈ ${numberString}`;
  }

  return numberString;
};
