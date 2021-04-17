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
    <div className="col-12 col-md-6">
      <div className="row">
        <h2 className="w-100 text-center">
          <span className="text-secondary">
            {t(translations.marketingPage.liquidity.asset)}:
          </span>
          <span>
            {props.data?.asset && symbolByTokenAddress(props.data.asset)}
          </span>
        </h2>
      </div>
      <Div className="mt-3">
        <Label className="text-center">
          {t(translations.marketingPage.liquidity.sov)}
          <br />
          {t(translations.marketingPage.liquidity.reward)}
          <br />
          {t(translations.marketingPage.liquidity.pool)}
        </Label>
      </Div>
      <div className="row my-3">
        <div className="w-100 text-center font-family-montserrat">
          {t(translations.marketingPage.liquidity.rewardPool)}:{' '}
          {props.data?.percentage}%
        </div>
        <div className="w-100 text-center font-family-montserrat">
          {t(translations.marketingPage.liquidity.rewardPool)}: {yourSOV}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="w-100 text-center mt-5 mb-3">
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
            <div className="w-100 text-center mt-5">
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
