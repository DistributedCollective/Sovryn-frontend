import React from 'react';
import { PreviousSalesRow, PreviousSalesRowWrapper } from './styled';
import { PreviousSalesCard } from '../PreviousSalesCard/index';
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';
import imgGenesis from 'assets/origins_launchpad/GEN-NFT-COMMUNITY.svg';
import imgOrigins from 'assets/origins_launchpad/GURU_BADGER_NFT.svg';
import { toNumberFormat } from 'utils/display-text/format';
import './module.scss';

export const PreviousSalesCardSection: React.FC = () => (
  <PreviousSalesRowWrapper>
    <PreviousSalesRow>
      <PreviousSalesCard
        saleName="FISH Origins Sale"
        saleAllocation={`${toNumberFormat(19992000)} FISH`}
        totalRaised="TBC"
        price="229 Sats"
        participatingWallets="TBC"
        date="26th Aug 2021"
        saleDuration="Approx 30 minutes"
        cardClassName="fish-card"
        backgroundImage={imgBabelfish}
      />
      <PreviousSalesCard
        saleName="SOV Origins Sale"
        saleAllocation={`${toNumberFormat(2000000)} SOV`}
        totalRaised="195 BTC"
        price="9736 Sats"
        participatingWallets="3267"
        date="10th - 13th Feb 2021"
        saleDuration="Approx 48Hr"
        className="tw-pt-12 sm:tw-pt-8 xl:tw-pt-0 xl:tw-ml-8 xl:tw-ml-16 2xl:tw-ml-36"
        backgroundImage={imgOrigins}
      />
    </PreviousSalesRow>
    <PreviousSalesRow>
      <PreviousSalesCard
        saleName="SOV Genesis sale"
        saleAllocation={`${toNumberFormat(2641946.1868, 4)} CSOV`}
        totalRaised={`${toNumberFormat(56.17867039, 8)} BTC`}
        price="2500 Sats"
        participatingWallets="~ 650"
        date="25 Jan 2021"
        saleDuration="27 minutes"
        className="tw-pt-12 sm:tw-pt-8 xl:tw-pt-0"
        backgroundImage={imgGenesis}
      />
    </PreviousSalesRow>
  </PreviousSalesRowWrapper>
);
