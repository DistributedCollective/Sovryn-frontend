import React from 'react';
import { DialogWrapper } from './styled';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';
import { useGetSaleInformation } from 'app/pages/OriginsLaunchpad/hooks/useGetSaleInformation';

interface IBuyDialogProps {
  saleName: string;
}

export const BuyDialog: React.FC<IBuyDialogProps> = ({ saleName }) => {
  const info = useGetSaleInformation(1);

  return (
    <DialogWrapper>
      <InformationSection saleName={saleName} info={info} />
      <BuySection
        saleName={saleName}
        depositRate={info.depositRate}
        sourceToken={info.depositToken}
      />
    </DialogWrapper>
  );
};
