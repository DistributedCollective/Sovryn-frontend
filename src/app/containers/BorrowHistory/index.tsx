import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { useGetBorrowHistoryData } from './hooks/useGetBorrowHistoryData';
import { Table } from 'app/components/Table';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { toAssetNumberFormat } from 'utils/display-text/format';

export const BorrowHistory: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading } = useGetBorrowHistoryData();

  const rows = useMemo(() => {
    if (!data || loading) return null;
    return data.borrows.map(item => {
      return {
        key: item.loanId.id,
        borrowAmount: item.newPrincipal,
        collateralAmount: item.newCollateral,
        interestAPR: item.interestRate,
        timestamp: item.timestamp,
        loanToken: item.loanToken,
        collateralToken: item.collateralToken,
      };
    });
  }, [data, loading]);

  const columns = useMemo(
    () => [
      {
        id: 'borrowAmount',
        title: t(translations.borrowHistory.table.headers.borrowAmount),
        cellRenderer: row => {
          const loanToken = AssetsDictionary.getByTokenContractAddress(
            row.loanToken,
          );
          return (
            <>
              {toAssetNumberFormat(row.borrowAmount, loanToken.asset)}{' '}
              <AssetRenderer asset={loanToken.asset} />
            </>
          );
        },
      },
      {
        id: 'collateralAmount',
        title: t(translations.borrowHistory.table.headers.collateralAmount),
        cellRenderer: row => {
          const collateralToken = AssetsDictionary.getByTokenContractAddress(
            row.collateralToken,
          );
          return (
            <>
              {toAssetNumberFormat(row.collateralAmount, collateralToken.asset)}{' '}
              <AssetRenderer asset={collateralToken.asset} />
            </>
          );
        },
      },
      {
        id: 'interestAPR',
        title: t(translations.borrowHistory.table.headers.interestAPR),
        cellRenderer: row => <>{Number(row.interestAPR).toFixed(2)} %</>,
      },
      {
        id: 'timestamp',
        title: t(translations.borrowHistory.table.headers.timestamp),
        cellRenderer: row => <DisplayDate timestamp={row.timestamp} />,
      },
    ],
    [t],
  );
  return <Table rows={rows} columns={columns} />;
};
