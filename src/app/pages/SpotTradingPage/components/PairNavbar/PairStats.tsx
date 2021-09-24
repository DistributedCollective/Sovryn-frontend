import React from 'react';

export const PairStats: React.FC = () => {
  return (
    <div className="tw-flex tw-items-center tw-justify-around tw-flex-1 tw-py-3 tw-text-xs">
      <div>
        Last traded price:{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-primary">
          91998 sats
        </span>
      </div>

      <div>
        24hr % Change:{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
          +1.45%
        </span>
      </div>

      <div>
        24hr Low:{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-short">
          76225 Sats
        </span>
      </div>
      <div>
        24hr High:{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm tw-text-trade-long">
          76225 Sats
        </span>
      </div>

      <div>
        24hr Turnover:{' '}
        <span className="tw-ml-2 tw-font-semibold tw-text-sm">100,000 SOV</span>
      </div>
    </div>
  );
};
