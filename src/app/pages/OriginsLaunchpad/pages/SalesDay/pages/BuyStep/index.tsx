import React from 'react';
import { Instructions } from './components/Instructions';
import { BuyDialog } from './components/BuyDialog';
import { ISaleInformation } from 'app/pages/OriginsLaunchpad/types';

interface IBuyStepProps {
  saleName: string;
  saleInformation: ISaleInformation;
}

export const BuyStep: React.FC<IBuyStepProps> = ({
  saleName,
  saleInformation,
}) => (
  <>
    <div className="tw-flex">
      <BuyDialog saleInformation={saleInformation} saleName={saleName} />
      <Instructions saleName={saleName} />
    </div>
  </>
);
