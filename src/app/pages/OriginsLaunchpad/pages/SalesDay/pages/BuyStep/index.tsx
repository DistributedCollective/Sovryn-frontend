import React from 'react';
import { Instructions } from './components/Instructions';
import { BuyDialog } from './components/BuyDialog';
import { ISaleInformation } from 'app/pages/OriginsLaunchpad/types';

interface IBuyStepProps {
  saleName: string;
  saleInformation: ISaleInformation;
  tierId: number;
}

export const BuyStep: React.FC<IBuyStepProps> = ({
  saleName,
  saleInformation,
  tierId,
}) => (
  <>
    <div className="tw-flex">
      <BuyDialog
        tierId={tierId}
        saleInformation={saleInformation}
        saleName={saleName}
      />
      <Instructions saleName={saleName} />
    </div>
  </>
);
