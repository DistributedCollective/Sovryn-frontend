import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { translations } from 'locales/i18n';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';

import { EventTable } from './EventTable';

export interface Props {
  data: {
    asset: string;
    percentage: number | undefined;
    pool: string;
    txList: Array<any>;
    weightedAmount: number;
    weightedTotal: number | undefined;
  };
  isConnected: boolean;
}

export function PoolData(props: Props) {
  const sovReward = 25000;
  const yourSOV =
    props.data.percentage && (sovReward / 100) * props.data.percentage;
  const { t } = useTranslation();

  return (
    <div className="tw-col-12 md:col-6 tw-text-white">
      <div>
        <h2 className="tw-w-full tw-text-center">
          <span className="tw-text-secondary">
            {t(translations.marketingPage.liquidity.asset)}:
          </span>
          <span className="tw-text-white">
            {symbolByTokenAddress(props.data.asset)}
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
          {props.data.percentage?.toFixed(2)}%
        </div>
        <div className="tw-w-full tw-text-center">
          {t(translations.marketingPage.liquidity.rewardPool)}:{' '}
          {yourSOV?.toFixed(2)}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="tw-w-full tw-text-center tw-mt-12 tw-mb-12">
            {t(translations.marketingPage.liquidity.miningEvent)}
          </h3>
          {props.data.txList.length > 0 ? (
            <EventTable data={props.data.txList} />
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
  margin-top: 15px;
`;
