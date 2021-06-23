import React from 'react';
import { LoadableValue } from '../LoadableValue';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { useGetFishDollarValue } from 'app/pages/OriginsLaunchpad/hooks/useGetFishDollarValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';

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
  const dollarValue = useGetFishDollarValue(Number(value));

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
          value={numberToUSD(Number(weiToFixed(dollarValue.value, 4)), 4)}
          loading={dollarValue.loading}
        />
      </td>
      <td className="tw-text-right"></td>
    </tr>
  );
};
