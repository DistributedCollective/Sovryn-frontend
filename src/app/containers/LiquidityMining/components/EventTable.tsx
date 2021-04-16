import React from 'react';

export interface Props {
  data: Array<any>;
  sov: boolean;
}

export function EventTable(props: Props) {
  const totalAdded = !props.sov
    ? props.data
        ?.filter(item => item.type === 'Added')
        .map(item => parseFloat(item.reserve_amount))
        .reduce((item, sum) => sum + item, 0)
    : props.data
        ?.filter(item => item.type === 'Added')
        .map(item => parseInt(item.sov_amount))
        .reduce((item, sum) => sum + item, 0);

  const totalRemoved = !props.sov
    ? props.data
        ?.filter(item => item.type === 'Removed')
        .map(item => parseFloat(item.reserve_amount))
        .reduce((item, sum) => sum + item, 0)
    : props.data
        ?.filter(item => item.type === 'Removed')
        .map(item => parseInt(item.sov_amount))
        .reduce((item, sum) => sum + item, 0);

  const totalBtcAdded = props.sov
    ? props.data
        ?.filter(item => item.type === 'Added')
        .map(item => parseFloat(item.btc_amount))
        .reduce((item, sum) => sum + item, 0)
    : null;

  const totalBtcRemoved = props.sov
    ? props.data
        ?.filter(item => item.type === 'Removed')
        .map(item => parseInt(item.btc_amount))
        .reduce((item, sum) => sum + item, 0)
    : null;

  const rows = props.data?.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="align-middle">{item.type}</td>
      {props.sov === false && (
        <td className="align-middle">{item.reserve_amount}</td>
      )}
      {props.sov && (
        <>
          <td className="align-middle">{parseInt(item.sov_amount)}</td>
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
      value: totalAdded,
      btcValue: totalBtcAdded,
    },
    {
      title: 'Total Removed',
      value: totalRemoved,
      btcValue: totalBtcRemoved,
    },
    {
      title: 'Total Remaining',
      value: totalAdded - totalRemoved,
      btcValue: (totalBtcAdded || 0) - (totalBtcRemoved || 0),
    },
  ];

  const totalRows = totalData.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="align-middle font-weight-bold">{item.title}</td>
      <td className="align-middle font-weight-bold">
        {props.sov ? item.value : item.value?.toFixed(4)}
      </td>
      {props.sov && (
        <>
          <td className="align-middle font-weight-bold">
            {item.btcValue?.toFixed(4)}
          </td>
        </>
      )}
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
          {totalRows}
        </tbody>
      </table>
    </div>
  );
}

EventTable.defaultProps = {
  sov: false,
};
