import React from 'react';

export const DappyPage: React.FC = () => {
  return (
    <div
      className="tw-bg-gray-4 tw-flex-1 tw-h-0"
      style={{ marginTop: '-4.4rem' }}
    >
      <iframe
        title="Dappy Network"
        src="https://v2-staging.dappy.network/#/widget/sovryn"
        className="tw-h-full tw-w-full"
      >
        <p>iFrames are not supported.</p>
      </iframe>
    </div>
  );
};
