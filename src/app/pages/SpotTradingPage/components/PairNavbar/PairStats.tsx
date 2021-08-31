import React from 'react';

export const PairStats: React.FC = () => {
  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-py-3">
      <div>
        Last traded price: <span>91998 sats</span>
      </div>

      <div>
        24hr % Change: <span>+1.45%</span>
      </div>

      <div>
        24hr Low: <span>76225 Sats</span>
      </div>
      <div>
        24hr High: <span>76225 Sats</span>
      </div>

      <div>
        24hr Turnover: <span>100,000 SOV</span>
      </div>
    </div>
  );
};
