/**
 *
 * BorrowAssetPrice
 *
 */
import React, { useEffect } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { LoadableValue } from '../LoadableValue';
import tooltipData from 'utils/data/tooltip-text.json';

interface Props {
  asset: Asset;
  onChange: (amount: string) => void;
}

export function BorrowAssetPrice(props: Props) {
  const { value, loading } = useBorrowAssetPrice(props.asset);

  useEffect(() => {
    props.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.onChange]);

  return (
    <div className="mb-2">
      <div className="d-inline text-lightGrey">
        <Tooltip content={tooltipData.trading.AssetPrice}>Asset Price</Tooltip>
      </div>
      <div className="d-inline float-right">
        <LoadableValue
          value={
            <Tooltip content={<>{weiToFixed(value, 18)}%</>}>
              <>
                <span className="text-lightGrey">$</span>
                {weiToFixed(value, 2)}
              </>
            </Tooltip>
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

BorrowAssetPrice.defaultProps = {
  onChange: (amount: string) => {},
};
