import React from 'react';
import { DialogWrapper } from './styled';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';

export const BuyDialog: React.FC = () => (
  <DialogWrapper>
    <InformationSection />
    <BuySection />
  </DialogWrapper>
);
