import React from 'react';

type AlertBadgeProps = {};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ children }) => {
  return (
    <div className="tw-my-8 tw-p-3 tw-border tw-border-trade-short-75 tw-bg-trade-short-10 tw-rounded">
      {children}
    </div>
  );
};
