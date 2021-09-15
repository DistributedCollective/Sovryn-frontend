import React from 'react';
import { PairStats } from './PairStats';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';

export const PairNavbar: React.FC = () => {
  const location = useLocation();

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
      default:
        return '';
    }
  };

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container">
        <PairSelect storageKey={getStorageKey()} />

        <PairStats />
      </div>
    </div>
  );
};
