import React from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { ContractName } from './styled';
import classNames from 'classnames';

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
}) => {
  return loading ? (
    <tr className={classNames('tw-h-16', className)} key={contractName}>
      <td className={className}>{contractName}</td>
      <td className={className}>
        <SkeletonRow />
      </td>
      <td className={className}>
        <SkeletonRow />
      </td>
    </tr>
  ) : (
    <tr
      className={classNames('tw-h-16 tw-font-extralight', className)}
      key={contractName}
    >
      <ContractName className={contractClassName}>{contractName}</ContractName>
      <td className={classNames(className, 'tw-text-right')}>
        {(!isNaN(btcValue) &&
          btcValue?.toLocaleString('en', {
            maximumFractionDigits: 4,
            minimumFractionDigits: 4,
          })) || <div className="bp3-skeleton">&nbsp;</div>}
      </td>
      <td className={classNames('tw-text-right', className)}>
        {(!isNaN(usdValue) &&
          usdValue?.toLocaleString('en', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })) || <div className="bp3-skeleton">&nbsp;</div>}
      </td>
    </tr>
  );
};
