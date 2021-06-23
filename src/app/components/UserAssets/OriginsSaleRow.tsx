import React from 'react';
import { LoadableValue } from '../LoadableValue';
import { weiToNumberFormat } from '../../../utils/display-text/format';

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
}) => (
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
    <td className="tw-text-right">N/A</td>
    <td className="tw-text-right"></td>
  </tr>
);
