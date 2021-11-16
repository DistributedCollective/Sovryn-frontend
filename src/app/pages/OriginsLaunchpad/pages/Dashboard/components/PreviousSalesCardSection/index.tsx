import React from 'react';
import { PreviousSalesRow, PreviousSalesRowWrapper } from './styled';
import { PreviousSalesCard } from '../PreviousSalesCard/index';
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';
import imgGenesis from 'assets/origins_launchpad/GEN-NFT-COMMUNITY.svg';
import imgOrigins from 'assets/origins_launchpad/GURU_BADGER_NFT.svg';
import imgMynt from 'assets/origins_launchpad/MYNT_NFT_Large.png';
import { toNumberFormat } from 'utils/display-text/format';
import './module.scss';

export const PreviousSalesCardSection: React.FC = () => (
  <PreviousSalesRowWrapper>
    <PreviousSalesRow className="tw-flex tw-flex-wrap tw-items-stretch tw-justify-evenly 2xl:tw-justify-between">
      <PreviousSalesCard
        saleName="Mynt Origins Bootstrap Event"
        saleAllocation={`${toNumberFormat(37035000)} MYNT`}
        totalRaised="370350 SOV"
        price="0.01 SOV"
        participatingWallets="3348"
        date="8th - 15th Nov 2021"
        saleDuration="1 week"
        cardClassName="mynt-image tw-flex tw-flex-col tw-justify-center"
        backgroundElem={
          <img
            src={imgMynt}
            className="tw-border-solid tw-border-4 tw-rounded-xl tw-border-gray-9"
            alt="MYNT"
          />
        }
      />
      <PreviousSalesCard
        saleName="FISH Origins Sale"
        saleAllocation={`${toNumberFormat(19992000)} FISH`}
        totalRaised="45.7298 BTC"
        price="229 Sats"
        participatingWallets="1022"
        date="26th Aug 2021"
        saleDuration="Approx 30 minutes"
        cardClassName="fish-card"
        className="tw-pt-12 sm:tw-pt-8 xl:tw-pt-0"
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
        className="tw-pt-12 sm:tw-pt-8 xl:tw-pt-0"
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
        className="tw-pt-12 sm:tw-pt-8 xl:tw-pt-0"
        backgroundImage={imgGenesis}
      />
    </PreviousSalesRow>
  </PreviousSalesRowWrapper>
);
