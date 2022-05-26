import React from 'react';
import { VestedHistoryTableRow } from './VestedHistoryTableRow';

interface IVestedHistoryTable {
  items: any;
}

export const VestedHistoryTable: React.FC<IVestedHistoryTable> = ({
  items,
}) => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <VestedHistoryTableRow
            key={item.transactionHash + index}
            item={item}
          />
        );
      })}
    </>
  );
};
