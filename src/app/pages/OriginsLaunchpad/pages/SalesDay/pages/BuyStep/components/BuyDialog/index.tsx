import React from 'react';
import { DialogWrapper } from './styled';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';

interface IBuyDialogProps {
  saleName: string;
}

export const BuyDialog: React.FC<IBuyDialogProps> = ({ saleName }) => (
  <DialogWrapper>
    <InformationSection saleName={saleName} />
    <BuySection saleName={saleName} />
  </DialogWrapper>
);
