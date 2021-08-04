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
import { weiToNumberFormat } from 'utils/display-text/format';
import { LoadableValue } from '../../../LoadableValue';

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
      <React.Fragment key={item.id}>
        <div
          className={`tw-grid tw-grid-cols-12 tw-gap-8 mobile-row ${
            !expanded && 'opaque'
          }`}
          onClick={() => {
            props.setExpandedId(props.expandedId === item.id ? '' : item.id);
          }}
        >
          <div className="tw-col-span-2 tw-flex tw-items-center">
            {item.icon === 'LONG' && (
              <Icon
                icon="circle-arrow-up"
                className="tw-text-customTeal tw-mx-2"
                iconSize={20}
              />
            )}
            {item.icon === 'SHORT' && (
              <Icon
                icon="circle-arrow-down"
                className="tw-text-Gold tw-ml-2"
                iconSize={20}
              />
            )}
          </div>
          <div className="tw-col-span-4 tw-flex tw-items-center">
            <LoadableValue
              loading={false}
              value={
                <>
                  {weiToNumberFormat(item.positionSize, 4)} {item.currency}
                </>
              }
              tooltip={item.positionSize}
            />
          </div>
          <div className={`tw-col-span-3 tw-flex tw-items-center`}>
            {item.profit}
          </div>
          <div
            className={`tw-col-span-3 ${
              item.id === props.expandedId ? 'tw-hidden' : 'tw-block'
            }`}
          >
            {item.actions}
          </div>
        </div>
        {item.id === props.expandedId && (
          <ExpandedRowMobile
            key={item.id}
            item={item}
            handleClick={() => props.setExpandedId('')}
          />
        )}
      </React.Fragment>
    );
  });

  return (
    <div className="tw-bg-background sovryn-border tw-p-4 tw-block md:tw-hidden">
      <div className="sovryn-table sovryn-table-mobile tw-p-4">
        <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 table-header">
          <div className="tw-col-span-2" />
          <div className="tw-col-span-4">
            {t(translations.activeLoan.table.positionSize)}
          </div>
          <div className="tw-col-span-3">
            {t(translations.activeLoan.table.profit)}
          </div>
          <div className="tw-col-span-3" />
        </div>
        {rows}
      </div>
    </div>
  );
}
