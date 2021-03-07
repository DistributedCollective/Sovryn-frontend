/**
 *
 * ExpandedRowMobile
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberToUSD, numberToPercent } from 'utils/display-text/format';

export function ExpandedRowMobile(props) {
  const { t } = useTranslation();
  const s = translations.expandedRowMobile;

  return (
    <div style={{ opacity: '1' }} onClick={props.handleClick}>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 table-header sub-header">
        <div className="tw-col-span-4">{t(s.currentMargin)}</div>
        <div className="tw-col-span-4">{t(s.interestAPR)}</div>
        <div className="tw-col-span-4">{t(s.startPrice)}</div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 mobile-expanded-row pb-2">
        <div className="tw-col-span-4">
          {numberToPercent(props.item.currentMargin, 2)}
        </div>
        <div className="tw-col-span-4">{props.item.interestAPR} %</div>
        <div className="tw-col-span-4">
          {numberToUSD(props.item.startPrice, 2)}
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 table-header sub-header">
        <div className="tw-col-span-4">{t(s.leverage)}</div>
        <div className="tw-col-span-4">{t(s.startMargin)}</div>
        <div className="tw-col-span-4">{t(s.maintenanceMargin)}</div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 mobile-expanded-row pb-2">
        <div className="tw-col-span-4">{props.item.leverage}X</div>
        <div className="tw-col-span-4">
          {numberToPercent(props.item.startMargin, 2)}
        </div>
        <div className="tw-col-span-4">{props.item.maintenanceMargin}</div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 table-header sub-header">
        <div className="tw-col-span-4">{t(s.currentPrice)}</div>
        <div className="tw-col-span-4">{t(s.liquidationPrice)}</div>
        <div className="tw-col-span-4" />
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 mobile-expanded-row pb-2">
        <div className="tw-col-span-4">{props.item.currentPrice}</div>
        <div className="tw-col-span-4">
          {numberToUSD(props.item.liquidationPrice, 2)}
        </div>
        <div className="tw-col-span-4" />
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 table-header sub-header">
        <div className="tw-col-span-8">{t(s.renewalDate)}</div>
        <div className="tw-col-span-4" />
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 mobile-expanded-row tw-pb-4 tw-border-b">
        <div className="tw-col-span-8">{props.item.endDate}</div>
        <div className="tw-col-span-4">{props.item.actions}</div>
      </div>
    </div>
  );
}
