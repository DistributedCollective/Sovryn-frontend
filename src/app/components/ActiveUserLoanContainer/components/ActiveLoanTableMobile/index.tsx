/**
 *
 * ActiveLoanTableMobile
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ExpandedRowMobile } from '../ExpandedRowMobile';
import { Icon } from '@blueprintjs/core';
import { formatAsBTC, numberToUSD } from 'utils/display-text/format';

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
    currency: any;
  }>;
  setExpandedId: any;
  expandedId: string;
}

export function ActiveLoanTableMobile(props: Props) {
  const { t } = useTranslation();
  const rows = props.data.map(item => {
    const expanded = item.id === props.expandedId || !props.expandedId;
    return (
      <>
        <div
          key={item.id}
          className={`row mobile-row ${!expanded && 'opaque'}`}
          onClick={() => {
            props.setExpandedId(props.expandedId === item.id ? '' : item.id);
          }}
        >
          <div className="col-2">
            {item.icon === 'LONG' && (
              <Icon
                icon="circle-arrow-up"
                className="text-customTeal mx-2"
                iconSize={20}
              />
            )}
            {item.icon === 'SHORT' && (
              <Icon
                icon="circle-arrow-down"
                className="text-Gold ml-2"
                iconSize={20}
              />
            )}
          </div>
          <div className="col-4">
            {formatAsBTC(item.positionSize, item.currency)}
          </div>
          <div
            className={`col-3 ${item.profit > 0 ? 'text-green' : 'text-red'}`}
          >
            {numberToUSD(item.profit, 2)}
          </div>
          <div
            className={`col-3 ${
              item.id === props.expandedId ? 'd-none' : 'd-block'
            }`}
          >
            {item.mobileActions}
          </div>
        </div>
        {item.id === props.expandedId && (
          <ExpandedRowMobile
            key={item.id}
            item={item}
            handleClick={() => props.setExpandedId('')}
          />
        )}
      </>
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
