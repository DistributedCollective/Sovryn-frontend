/**
 *
 * ExpandedRowMobile
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function ExpandedRowMobile(props) {
  const { t } = useTranslation();
  const s = translations.expandedRowMobile;

  return (
    <div style={{ opacity: '1' }} onClick={props.handleClick}>
      <div className="row mobile-row mobile-expanded-row border-top">
        <div className="col-2 mr-1 font-smaller">{props.item.icon}</div>
        <div className="col-4">{props.item.positionSize}</div>
        <div className="col-3">{props.item.profit}</div>
        <div className="col-3"></div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">{t(s.currentMargin)}</div>
        <div className="col-4">{t(s.interestAPR)}</div>
        <div className="col-4">{t(s.startPrice)}</div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.currentMargin}</div>
        <div className="col-4">{props.item.interestAPR}</div>
        <div className="col-4">{props.item.startPrice}</div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">{t(s.leverage)}</div>
        <div className="col-4">{t(s.startMargin)}</div>
        <div className="col-4">{t(s.maintenanceMargin)}</div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.leverage}</div>
        <div className="col-4">{props.item.startMargin}</div>
        <div className="col-4">{props.item.maintenanceMargin}</div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">{t(s.currentPrice)}</div>
        <div className="col-4">{t(s.liquidationPrice)}</div>
        <div className="col-4"></div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.currentPrice}</div>
        <div className="col-4">{props.item.liquidationPrice}</div>
        <div className="col-4"></div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-8">{t(s.renewalDate)}</div>
        <div className="col-4"></div>
      </div>
      <div className="row mobile-expanded-row pb-3 border-bottom">
        <div className="col-8">{props.item.endDate}</div>
        <div className="col-4">{props.item.mobileActions}</div>
      </div>
    </div>
  );
}
