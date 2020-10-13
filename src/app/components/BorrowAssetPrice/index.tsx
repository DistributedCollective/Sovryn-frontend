/**
 *
 * BorrowAssetPrice
 *
 */
import React, { useEffect } from 'react';
import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { LoadableValue } from '../LoadableValue';

interface Props {
  asset: Asset;
  onChange: (amount: string) => void;
}

export function BorrowAssetPrice(props: Props) {
  const { value, loading } = useBorrowAssetPrice(props.asset, Asset.DOC);

  useEffect(() => {
    props.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.onChange]);

  return (
    <LoadableValue
      value={
        <span style={{ verticalAlign: 'middle' }}>
          <span className="text-lightGrey">Price: $</span>
          {parseFloat(weiToFixed(value, 2)).toLocaleString('en', {
            minimumFractionDigits: 2,
          })}
        </span>
      }
      loading={loading}
    />
  );
}

BorrowAssetPrice.defaultProps = {
  onChange: (amount: string) => {},
};
