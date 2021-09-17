import { Tooltip } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from '../../../types';
import { fromWei, numberFromWei } from '../../../utils/blockchain/math-helpers';
import { formatAsNumber } from '../../../utils/display-text/format';
import { AssetSymbolRenderer } from '../AssetSymbolRenderer';

enum AssetValueMode {
  defined = 'defined',
  auto = 'auto',
}

type IAssetValueProps = {
  value: number | string;
  asset?: Asset;
  useTooltip?: boolean;
  mode?: AssetValueMode;
  minDecimals?: number;
  maxDecimals?: number;
  className?: string;
};

// Defined by counting digits befor the comma +1 of the rounded price
const AssetDecimals: { [key in Asset]: number } = {
  CSOV: 2,
  RBTC: 6,
  ETH: 5,
  DOC: 2,
  USDT: 2,
  XUSD: 2,
  BPRO: 6,
  SOV: 3,
  MOC: 1,
  BNBS: 4,
  FISH: 1,
};

export const AssetValue: React.FC<IAssetValueProps> = ({
  value,
  asset,
  mode,
  useTooltip,
  minDecimals,
  maxDecimals,
  className,
}) => {
  const [formattedValue, fullFormattedValue] = useMemo(() => {
    if (value) {
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
    }

    return [];
  }, [value, minDecimals, maxDecimals, mode, asset]);

  if (!formattedValue) {
    return null;
  }

  const assetValue = (
    <span className={className}>
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

AssetValue.defaultProps = {
  minDecimals: 0,
  maxDecimals: 6,
  mode: AssetValueMode.defined,
  useTooltip: false,
};
