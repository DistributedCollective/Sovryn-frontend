import React from 'react';
import { PreviousSalesCard } from '../PreviousSalesCard/index';
import imgBabelfish from 'assets/origins_launchpad/BABELFISH_NFT.svg';
import imgGenesis from 'assets/origins_launchpad/GEN-NFT-COMMUNITY.svg';
import imgOrigins from 'assets/origins_launchpad/GURU_BADGER_NFT.svg';
import imgMynt from 'assets/origins_launchpad/MYNT_NFT_Large.png';
import { toNumberFormat } from 'utils/display-text/format';
import styles from './index.module.scss';

export const PreviousSalesCardSection: React.FC = () => (
  <div className="tw-mt-10">
    <div className="tw-flex tw-bg-gray-2 tw-rounded-xl tw-px-6 tw-py-4 tw-flex-col tw-flex-wrap tw-items-stretch tw-justify-evenly tw-gap-y-12 xl:tw-flex-row xl:tw-p-10 2xl:tw-justify-between">
      <PreviousSalesCard
        saleName="Mynt Origins Bootstrap Event"
        saleAllocation={`${toNumberFormat(37035000)} MYNT`}
        totalRaised="370350 SOV"
        price="0.01 SOV"
        participatingWallets="3348"
        date="8th - 15th Nov 2021"
        saleDuration="1 week"
        cardClassName={styles.myntImage}
        backgroundElem={
          <img
            src={imgMynt}
            className="tw-border-solid tw-border-6 tw-rounded-xl tw-border-white"
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
        backgroundImage={imgGenesis}
      />
    </div>
  </div>
);
