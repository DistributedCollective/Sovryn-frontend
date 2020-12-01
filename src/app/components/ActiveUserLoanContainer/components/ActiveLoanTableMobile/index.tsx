/**
 *
 * ActiveLoanTableMobile
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ExpandedRowMobile } from '../ExpandedRowMobile';

interface Props {
  data: Array<{
    actions: any;
    currentMargin: any;
    currentPrice: string;
    endDate: any;
    icon: any;
    id: string;
    interestAPR: any;
    leverage: string;
    liquidationPrice: any;
    maintenanceMargin: string;
    mobileActions: any;
    positionSize: string;
    profit: any;
    startMargin: string;
    startPrice: string;
  }>;
  setExpandedId: any;
  expandedId: string;
}

export function ActiveLoanTableMobile(props: Props) {
  const { t } = useTranslation();
  const rows = props.data.map(item => {
    return item.id === props.expandedId ? (
      <ExpandedRowMobile
        key={item.id}
        item={item}
        handleClick={() => props.setExpandedId('')}
      />
    ) : (
      <div
        key={item.id}
        className="row mobile-row"
        onClick={() => {
          props.setExpandedId(item.id);
        }}
        style={{ opacity: props.expandedId ? '0.2' : '1' }}
      >
        <div className="col-2">{item.icon}</div>
        <div className="col-4">{item.positionSize}</div>
        <div className="col-3">{item.profit}</div>
        <div className="col-3">{item.mobileActions}</div>
      </div>
    );
  });

  return (
    <div className="bg-primary sovryn-border p-3 d-block d-md-none">
      <div className="sovryn-table sovryn-table-mobile p-3">
        <div className="row table-header">
          <div className="col-2"></div>
          <div className="col-4">
            {t(translations.activeLoan.table.positionSize)}
          </div>
          <div className="col-3">{t(translations.activeLoan.table.profit)}</div>
          <div className="col-3"></div>
        </div>
        {rows}
      </div>
    </div>
  );
}
