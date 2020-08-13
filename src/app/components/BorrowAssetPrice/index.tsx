/**
 *
 * BorrowAssetPrice
 *
 */
import React, { useEffect } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowAssetPrice } from 'hooks/borrow/useBorrowAssetPrice';
import { LoadableValue } from '../LoadableValue';

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
      <div>Asset Price</div>
      <div>
        <LoadableValue
          value={
            <Tooltip content={<>${weiToFixed(value, 18)}</>}>
              <>${weiToFixed(value, 4)}</>
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
