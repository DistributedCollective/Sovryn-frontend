import React from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { ContractName } from './styled';
import cn from 'classnames';

interface IDataRowProps {
  contractName: string;
  btcValue: number;
  usdValue: number;
  loading: boolean;
  className?: string;
  contractClassName?: string;
}

export const DataRow: React.FC<IDataRowProps> = ({
  contractName,
  btcValue,
  usdValue,
  loading,
  className,
  contractClassName,
}) =>
  loading ||
  !(btcValue && Number(btcValue) > 0 && usdValue && Number(usdValue) > 0) ? (
    <tr className={cn('tw-h-16', className)} key={contractName}>
      <td>{contractName}</td>
      <td>
        <SkeletonRow />
      </td>
      <td>
        <SkeletonRow />
      </td>
    </tr>
  ) : (
    <tr
      className={cn('tw-h-16 tw-font-extralight', className)}
      key={contractName}
    >
      <ContractName className={contractClassName}>{contractName}</ContractName>
      <td>
        {btcValue?.toLocaleString('en', {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        }) || <div className="bp3-skeleton">&nbsp;</div>}
      </td>
      <td>
        {usdValue?.toLocaleString('en', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) || <div className="bp3-skeleton">&nbsp;</div>}
      </td>
    </tr>
  );
