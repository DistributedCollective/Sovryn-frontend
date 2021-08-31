import React, { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { LoadableValue } from '../LoadableValue';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { Asset } from '../../../types';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';

interface IOriginsSaleRowProps {
  token: string;
  value: string;
  title: string;
  logo: string;
  loading: boolean;
}

export const OriginsSaleRow: React.FC<IOriginsSaleRowProps> = ({
  token,
  value,
  title,
  logo,
  loading,
}) => {
  const item = AssetsDictionary.get(Asset.FISH);
  const dollars = useCachedAssetPrice(Asset.FISH, Asset.USDT);
  const dollarValue = useMemo(() => {
    return bignumber(value)
      .mul(dollars.value)
      .div(10 ** item.decimals)
      .toFixed(0);
  }, [dollars.value, value, item.decimals]);

  return (
    <tr key={token}>
      <td>
        <img
          className="tw-inline tw-mr-2"
          style={{ height: '40px' }}
          src={logo}
          alt={token}
        />{' '}
        {title}
      </td>
      <td className="tw-text-right">
        <LoadableValue value={weiToNumberFormat(value, 4)} loading={loading} />
      </td>
      <td className="tw-text-right">
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-right" />
    </tr>
  );
};
