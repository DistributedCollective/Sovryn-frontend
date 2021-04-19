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
      <td className="align-middle">{item.type}</td>
      {!props.sov && <td className="align-middle">{item.reserve_amount}</td>}
      {props.sov && (
        <>
          <td className="align-middle">{item.sov_amount}</td>
          <td className="align-middle">{item.btc_amount}</td>
        </>
      )}
      <td className="align-middle d-md-table-cell d-none">
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
      <td className="align-middle font-weight-bold">{item.title}</td>
      <td className="align-middle font-weight-bold">{item.value}</td>
      <td className="align-middle font-weight-bold d-none d-md-table-cell"></td>
    </tr>
  ));
  return (
    <div>
      <table className="table sovryn-table align-middle">
        <thead className="">
          <tr className="">
            <th></th>
            {!props.sov && <th>Amount</th>}
            {props.sov && <th>SOV Amount</th>}
            {props.sov && <th>BTC Amount</th>}
            <th className="d-none d-md-table-cell">Block number</th>
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
