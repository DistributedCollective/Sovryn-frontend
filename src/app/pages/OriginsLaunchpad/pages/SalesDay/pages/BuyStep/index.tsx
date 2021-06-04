import React from 'react';
import { Instructions } from './components/Instructions';
import { BuyDialog } from './components/BuyDialog';

export const BuyStep: React.FC = () => (
  <>
    <div className="tw-flex">
      <BuyDialog />
      <Instructions />
    </div>
  </>
);
