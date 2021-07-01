import React from 'react';
import { Instructions } from './components/Instructions';
import { BuyDialog } from './components/BuyDialog';

interface IBuyStepProps {
  saleName: string;
}

export const BuyStep: React.FC<IBuyStepProps> = ({ saleName }) => (
  <>
    <div className="tw-flex">
      <BuyDialog saleName={saleName} />
      <Instructions saleName={saleName} />
    </div>
  </>
);
