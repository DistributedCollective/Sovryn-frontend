import React from 'react';
import { VestedHistoryTableRow } from './VestedHistoryTableRow';

interface IVestedHistoryTable {
  items: any;
}

export const VestedHistoryTable: React.FC<IVestedHistoryTable> = ({
  items,
}) => (
  <>
    {items.map((item, index) => (
      <VestedHistoryTableRow key={index} item={item} />
    ))}
  </>
);
