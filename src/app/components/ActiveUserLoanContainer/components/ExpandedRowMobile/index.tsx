/**
 *
 * ExpandedRowMobile
 *
 */

import React from 'react';

export function ExpandedRowMobile(props) {
  return (
    <div style={{ opacity: '1' }} onClick={props.handleClick}>
      <div className="row mobile-row mobile-expanded-row border-top">
        <div className="col-2 mr-1 font-smaller">{props.item.icon}</div>
        <div className="col-4">{props.item.positionSize}</div>
        <div className="col-3">{props.item.profit}</div>
        <div className="col-3"></div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">Current Margin</div>
        <div className="col-4">Interest APR</div>
        <div className="col-4">Start Price</div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.currentMargin}</div>
        <div className="col-4">{props.item.interestAPR}</div>
        <div className="col-4">{props.item.startPrice}</div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">Leverage</div>
        <div className="col-4">Start Margin</div>
        <div className="col-4">Maintenance Margin</div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.leverage}</div>
        <div className="col-4">{props.item.startMargin}</div>
        <div className="col-4">{props.item.maintenanceMargin}</div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-4">Current Price</div>
        <div className="col-4">Liquidation Price</div>
        <div className="col-4"></div>
      </div>
      <div className="row mobile-expanded-row pb-2">
        <div className="col-4">{props.item.currentPrice}</div>
        <div className="col-4">{props.item.liquidationPrice}</div>
        <div className="col-4"></div>
      </div>
      <div className="row table-header sub-header">
        <div className="col-8">Renewal Date</div>
        <div className="col-4"></div>
      </div>
      <div className="row mobile-expanded-row pb-3 border-bottom">
        <div className="col-8">{props.item.endDate}</div>
        <div className="col-4">{props.item.mobileActions}</div>
      </div>
    </div>
  );
}
