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
    <div className="col-12 col-md-6">
      <div className="row">
        <h2 className="w-100 text-center">
          <span className="text-secondary">
            {t(translations.marketingPage.liquidity.asset)}:
          </span>
          <span>{symbolByTokenAddress(props.data.asset)}</span>
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
          {props.data.percentage?.toFixed(2)}%
        </div>
        <div className="w-100 text-center font-family-montserrat">
          {t(translations.marketingPage.liquidity.rewardPool)}:{' '}
          {yourSOV?.toFixed(2)}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="w-100 text-center mt-5 mb-3">
            {t(translations.marketingPage.liquidity.miningEvent)}
          </h3>
          {props.data.txList.length > 0 ? (
            <EventTable data={props.data.txList} />
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
  margin-top: 30%;
`;
