import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { translations } from 'locales/i18n';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';

import { EventTable } from './EventTable';

export interface Props {
  data: {
    asset: string;
    pool: string;
    txList: Array<any>;
    totalAdded: string;
    totalRemoved: string;
    totalRemaining: string;
    percentage: string;
    sovReward: string;
  };
  isConnected: boolean;
}

export function PoolData(props: Props) {
  const yourSOV = props.data?.sovReward;
  const { t } = useTranslation();
  return (
    <div className="tw-col-12 md:col-6 tw-text-white">
      <div>
        <h2 className="tw-w-full tw-text-center">
          <span className="tw-text-secondary">
            {t(translations.marketingPage.liquidity.asset)}:
          </span>
          <span className="tw-text-white">
            {props.data?.asset && symbolByTokenAddress(props.data.asset)}
          </span>
        </h2>
      </div>
      <Div className="tw-mt-5 tw-flex tw-flex-col tw-items-center tw-justify-center">
        <Label className="tw-text-center">
          {t(translations.marketingPage.liquidity.sov)}
          <br />
          {t(translations.marketingPage.liquidity.reward)}
          <br />
          {t(translations.marketingPage.liquidity.pool)}
        </Label>
      </Div>
      <div className="tw-w-full tw-mt-5">
        <div className="tw-w-full tw-text-center">
          {t(translations.marketingPage.liquidity.rewardPool)}:{' '}
          {props.data?.percentage}%
        </div>
        <div className="tw-w-full tw-text-center">
          {t(translations.marketingPage.liquidity.rewardPool)}: {yourSOV}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="tw-w-full tw-text-center tw-mt-12 tw-mb-12">
            {t(translations.marketingPage.liquidity.miningEvent)}
          </h3>
          {props.data?.txList && props.data.txList.length > 0 ? (
            <EventTable
              data={props.data.txList}
              totalAdded={props.data.totalAdded}
              totalRemoved={props.data.totalRemoved}
              totalRemaining={props.data.totalRemaining}
            />
          ) : (
            <div className="tw-w-full tw-text-center tw-mt-12">
              {t(translations.marketingPage.liquidity.noAsset, {
                asset: symbolByTokenAddress(props.data.asset),
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const Div = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 100%;
  border: 10px solid var(--secondary);
`;

const Label = styled.h3`
  width: 100%;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
`;
