import React from 'react';

export interface Props {
  data: Array<any>;
}

export function EventTable(props: Props) {
  const totalAdded = props.data
    ?.filter(item => item.type === 'Added')
    .map(item => parseFloat(item.reserve_amount))
    .reduce((item, sum) => sum + item, 0);

  const totalRemoved = props.data
    ?.filter(item => item.type === 'Removed')
    .map(item => parseFloat(item.reserve_amount))
    .reduce((item, sum) => sum + item, 0);

  const rows = props.data?.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="align-middle">{item.type}</td>
      <td className="align-middle">{item.reserve_amount}</td>
      <td className="align-middle d-md-table-cell d-none">
        {item.block_number}
      </td>
    </tr>
  ));

  const totalData = [
    {
      title: 'Total Added',
      value: totalAdded,
    },
    {
      title: 'Total Removed',
      value: totalRemoved,
    },
    {
      title: 'Total Remaining',
      value: (totalAdded - totalRemoved) | 0,
    },
  ];

  const totalRows = totalData.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="align-middle font-weight-bold">{item.title}</td>
      <td className="align-middle font-weight-bold">
        {item.value?.toFixed(4)}
      </td>
      <td className="align-middle font-weight-bold d-none d-md-table-cell"></td>
    </tr>
  ));
  return (
    <div>
      <table className="table sovryn-table align-middle">
        <thead className="">
          <tr className="">
            <th></th>
            <th>Amount</th>
            <th className="d-none d-md-table-cell">Block number</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {totalRows}
        </tbody>
      </table>
    </div>
  );
}
