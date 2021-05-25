import React from 'react';
import { PreviousSalesRow, PreviousSalesRowWrapper } from './styled';
import { PreviousSalesCard } from '../PreviousSalesCard/index';
import imgGenesis from 'assets/origins_launchpad/GEN-NFT-COMMUNITY.svg';
import imgOrigins from 'assets/origins_launchpad/GURU_BADGER_NFT.svg';
import { toNumberFormat } from 'utils/display-text/format';

export const PreviousSalesCardSection: React.FC = () => (
  <PreviousSalesRowWrapper>
    <PreviousSalesRow>
      <PreviousSalesCard
        saleName="SOV Origins Sale"
        saleAllocation={`${toNumberFormat(2000000)} SOV`}
        totalRaised="195 BTC"
        price="9736 Sats"
        participatingWallets="3267"
        date="10th - 13th Feb 2021"
        saleDuration="Approx 48Hr"
        backgroundImage={imgOrigins}
      />

      <PreviousSalesCard
        saleName="SOV Genesis sale"
        saleAllocation={`${toNumberFormat(2641946.1868, 4)} CSOV`}
        totalRaised={`${toNumberFormat(56.17867039, 8)} BTC`}
        price="2500 Sats"
        participatingWallets="~ 650"
        date="25 Jan 2021"
        saleDuration="27 minutes"
        className="tw-ml-8 xl:tw-ml-16 2xl:tw-ml-36"
        backgroundImage={imgGenesis}
      />
    </PreviousSalesRow>
  </PreviousSalesRowWrapper>
);
