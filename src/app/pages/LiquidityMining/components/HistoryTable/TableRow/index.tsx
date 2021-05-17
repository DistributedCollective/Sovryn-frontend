import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LiquidityPool } from 'utils/models/liquidity-pool';
import { translations } from '../../../../../../locales/i18n';
import iconSuccess from 'assets/images/icon-success.svg';
import { TablePoolRenderer } from '../../../../../components/Finance V2 shared components/TablePoolRenderer/index';

interface ITableRowProps {
  pool: LiquidityPool;
}

export const TableRow: React.FC<ITableRowProps> = ({ pool }) => {
  const { t } = useTranslation();

  return (
    <tr>
      <td>
        <DisplayDate timestamp={new Date().getTime().toString()} />
      </td>
      <td>
        <TablePoolRenderer
          asset={pool.supplyAssets[0].asset}
          secondaryAsset={pool.supplyAssets[1].asset}
        />
      </td>
      <td>Deposit</td>
      <td>{pool.supplyAssets[1].asset}</td>
      <td>+10.000 {pool.supplyAssets[1].asset}</td>
      <td>
        <LinkToExplorer
          txHash="0x4130000089054"
          className="text-gold font-weight-normal text-nowrap"
          startLength={5}
          endLength={5}
        />
      </td>

      <td>
        <div className="d-flex align-items-center justify-content-between col-lg-10 col-md-12 p-0">
          <div>
            <p className="m-0">{t(translations.common.confirmed)}</p>
          </div>
          <div className="tw-hidden 2xl:tw-block">
            <img src={iconSuccess} title="Confirmed" alt="Confirmed" />
          </div>
        </div>
      </td>
    </tr>
  );
};
