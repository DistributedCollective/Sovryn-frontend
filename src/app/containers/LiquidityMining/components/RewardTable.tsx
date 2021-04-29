import React from 'react';

export interface Props {
  data: Array<WeekRewardType>;
}
export interface WeekRewardType {
  blockStart: number;
  rewardPool: number;
  percentage: string;
  sovReward: string;
  weekStart: string;
  weightedAmount: string;
}

export function RewardTable(props: Props) {
  const rows = props.data?.map((item, key) => (
    <tr key={key} style={{ height: '50px' }}>
      <td className="align-middle">
        {new Date(item.weekStart).toDateString()}
      </td>
      <td className="align-middle">{item.rewardPool} SOV</td>
      <td className="align-middle">{item.percentage}</td>
      <td className="align-middle d-md-table-cell d-none">{item.sovReward}</td>
    </tr>
  ));

  return (
    <div>
      <table className="table sovryn-table align-middle">
        <thead className="">
          <tr className="">
            <th>Week</th>
            <th>Reward Pool</th>
            <th>Your % *</th>
            <th>Your SOV Reward *</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

RewardTable.defaultProps = {
  sov: false,
};
