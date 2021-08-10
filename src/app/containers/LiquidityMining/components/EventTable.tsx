import React from 'react';

export interface Props {
  data: Array<any>;
  totalAdded: string;
  totalRemoved: string;
  totalRemaining: string;
  sov?: boolean;
}

export function EventTable(props: Props) {
  const rows = props.data?.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="tw-align-middle">{item.type}</td>
      {!props.sov && (
        <td className="tw-align-middle">
          {item.reserve_amount.hasOwnProperty('value')
            ? item.reserve_amount.value
            : item.reserve_amount}
        </td>
      )}
      {props.sov && (
        <>
          <td className="tw-align-middle">{item.sov_amount}</td>
          <td className="tw-align-middle">{item.btc_amount}</td>
        </>
      )}
      <td className="tw-align-middle md:tw-table-cell tw-hidden">
        {item.block_number}
      </td>
    </tr>
  ));

  const totalData = [
    {
      title: 'Total Added',
      value: props.totalAdded,
    },
    {
      title: 'Total Removed',
      value: props.totalRemoved,
    },
    {
      title: 'Total Remaining',
      value: props.totalRemaining,
    },
  ];

  const totalRows = totalData.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="tw-align-middle tw-font-bold">{item.title}</td>
      <td className="tw-align-middle tw-font-bold">{item.value}</td>
      <td className="tw-align-middle tw-font-bold tw-hidden md:tw-table-cell"></td>
    </tr>
  ));
  return (
    <div>
      <table className="table sovryn-table tw-align-middle">
        <thead className="">
          <tr className="">
            <th></th>
            {!props.sov && <th>Amount</th>}
            {props.sov && <th>SOV Amount</th>}
            {props.sov && <th>BTC Amount</th>}
            <th className="tw-hidden md:tw-table-cell">Block number</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {!props.sov && totalRows}
        </tbody>
      </table>
    </div>
  );
}

EventTable.defaultProps = {
  sov: false,
};
