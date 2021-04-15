import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';

import { translations } from 'locales/i18n';

import { EventTable } from './EventTable';

export interface Props {
  isConnected: boolean;
  txList: Array<any>;
}

export function SOVPoolData(props: Props) {
  const { t } = useTranslation();

  return (
    <div className="col-12">
      <Div className="mt-3">
        <Label className="text-center">
          75K SOV
          <br />
          {t(translations.marketingPage.liquidity.reward)}
          <br />
          {t(translations.marketingPage.liquidity.pool)}
        </Label>
      </Div>
      <div className="row my-3">
        <div className="w-100 text-center font-family-montserrat">
          {t(translations.marketingPage.liquidity.rewardPool)}: %
        </div>
        <div className="w-100 text-center font-family-montserrat">
          {t(translations.marketingPage.liquidity.rewardPool)}:{' '}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="w-100 text-center mt-5 mb-3">
            {t(translations.marketingPage.liquidity.miningEvent)}
          </h3>
          {props.txList.length > 0 ? (
            <EventTable data={[]} />
          ) : (
            <div className="w-100 text-center mt-5">
              {t(translations.marketingPage.liquidity.noAsset, {
                asset: 'SOV/BTC',
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
