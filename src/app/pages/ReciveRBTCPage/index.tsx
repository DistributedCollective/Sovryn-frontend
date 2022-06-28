import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { CrossChainLayout } from 'app/components/CrossChain/CrossChainLayout';
import { SelectBox } from '../BridgeDepositPage/components/SelectBox';
import btcIcon from 'assets/images/BTC.svg';

import dollarIcon from 'assets/images/fiat/dollar.svg';
import eruoIcon from 'assets/images/fiat/euro.svg';
import poundIcon from 'assets/images/fiat/pound.svg';
import { TransakDialog } from 'app/components/TransakDialog/TransakDialog';
import { Link } from 'react-router-dom';

export const ReciveRBTCPage: React.FC = () => {
  const [transack, setTransack] = useState(false);

  return (
    <>
      <Helmet>
        <title>Receive RBTC</title>
        <meta
          name="description"
          content={'Receive RBTC via bitcoin or bank/card transfer'}
        />
      </Helmet>

      <CrossChainLayout
        title="Receive RBTC"
        subtitle="Receive RBTC via bitcoin or bank/card transfer"
      >
        <div
          style={{
            minHeight: 610,
            width: 780,
            maxWidth: 'calc(100vw - 22rem)',
          }}
          className="tw-py-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-relative"
        >
          <div className="tw-mb-20 tw-text-base tw-text-center tw-font-semibold">
            Select Source
          </div>
          <div className="tw-flex tw-items-center tw-justify-center">
            <div className="tw-text-center">
              <Link to="/fast-btc/deposit">
                <SelectBox>
                  <img src={btcIcon} alt="btc" />
                </SelectBox>
              </Link>
              <p className="tw-mt-3 tw-font-medium">Bitcoin Network</p>
            </div>

            <div className="tw-text-center">
              <SelectBox onClick={() => setTransack(true)}>
                <div className="tw-flex">
                  <div className="tw-z-20 tw-border tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={dollarIcon} alt="dollar" />
                  </div>
                  <div className="tw-z-10 tw-border tw--ml-5 tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={poundIcon} alt="pound" />
                  </div>
                  <div className="tw-border tw--ml-5 tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={eruoIcon} alt="euro" />
                  </div>
                </div>
              </SelectBox>
              <p className="tw-mt-3 tw-font-medium">Bank/Card</p>
            </div>
          </div>
        </div>

        <TransakDialog isOpen={transack} onClose={() => setTransack(false)} />
      </CrossChainLayout>
    </>
  );
};
