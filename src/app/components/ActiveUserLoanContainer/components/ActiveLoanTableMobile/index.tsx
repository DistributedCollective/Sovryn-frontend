/**
 *
 * ActiveLoanTableMobile
 *
 */

import React from 'react';
import { ExpandedRowMobile } from '../ExpandedRowMobile';

interface Props {
  data: any;
  setExpandedId: any;
  setExpandedItem: any;
  expandedId: any;
  expandedItem: any;
}

export function ActiveLoanTableMobile(props: Props) {
  const rows = props.data.map(item => {
    return item.id === props.expandedId ? (
      <ExpandedRowMobile
        item={item}
        handleClick={() => props.setExpandedId('')}
      />
    ) : (
      <div
        className="row mobile-row"
        onClick={() => {
          props.setExpandedItem(item.id);
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
    <div className="bg-primary sovryn-border p-3">
      <div className="sovryn-table sovryn-table-mobile p-3">
        <div className="row table-header">
          <div className="col-2"></div>
          <div className="col-4">Position Size</div>
          <div className="col-3">Profit</div>
          <div className="col-3"></div>
        </div>
        {rows}
      </div>
    </div>
  );
}
