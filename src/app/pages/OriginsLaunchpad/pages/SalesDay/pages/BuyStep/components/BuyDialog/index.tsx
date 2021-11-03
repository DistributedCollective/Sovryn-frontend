import React from 'react';
import { InformationSection } from './components/InformationSection';
import { BuySection } from './components/BuySection';
import { ISaleInformation } from 'app/pages/OriginsLaunchpad/types';
import styles from './index.module.scss';

interface IBuyDialogProps {
  saleName: string;
  saleInformation: ISaleInformation;
}

export const BuyDialog: React.FC<IBuyDialogProps> = ({
  saleName,
  saleInformation,
}) => (
  <div className={styles.dialogWrapper}>
    <InformationSection saleName={saleName} info={saleInformation} />
    <BuySection
      saleName={saleName}
      depositRate={saleInformation.depositRate}
      sourceToken={saleInformation.depositToken}
      totalDeposit={saleInformation.yourTotalDeposit}
    />
  </div>
);
