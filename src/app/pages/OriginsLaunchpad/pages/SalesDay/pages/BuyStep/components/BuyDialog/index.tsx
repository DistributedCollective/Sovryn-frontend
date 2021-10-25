import React from 'react';
import { DialogWrapper } from './styled';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';
import { ISaleInformation } from 'app/pages/OriginsLaunchpad/types';

interface IBuyDialogProps {
  saleName: string;
  saleInformation: ISaleInformation;
  tierId: number;
}

export const BuyDialog: React.FC<IBuyDialogProps> = ({
  saleName,
  saleInformation,
  tierId,
}) => (
  <DialogWrapper>
    <InformationSection saleName={saleName} info={saleInformation} />
    <BuySection
      saleName={saleName}
      depositRate={saleInformation.depositRate}
      sourceToken={saleInformation.depositToken}
      totalDeposit={saleInformation.yourTotalDeposit}
      tierId={tierId}
      maxAmount={saleInformation.maxAmount}
    />
  </DialogWrapper>
);
