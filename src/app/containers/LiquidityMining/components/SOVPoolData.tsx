import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios, { Canceler } from 'axios';
import { useInterval } from 'app/hooks/useInterval';

import { translations } from 'locales/i18n';

import { EventTable } from './EventTable';
import { RewardPool } from './RewardPool';

export interface Props {
  isConnected: boolean;
  txList: Array<any>;
  user: string;
  rate: number;
}

export function SOVPoolData(props: Props) {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [data, setData] = useState([]);
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    if (props.user) {
      cancelDataRequest.current && cancelDataRequest.current();

      const cancelToken = new axios.CancelToken(c => {
        cancelDataRequest.current = c;
      });

      axios
        .get(api + '/amm/liquidity-mining/sov/' + props.user, {
          cancelToken,
        })
        .then(res => {
          setData(res.data);
        })
        .catch(e => console.error(e));
    }
  }, [api, props.user]);

  useInterval(getData, props.rate * 1e3, { immediate: true });

  return (
    <div className="tw-w-full">
      <Div className="tw-mt-4">
        <Label className="tw-text-center">
          75K SOV
          <br />
          {t(translations.marketingPage.liquidity.reward)}
          <br />
          {t(translations.marketingPage.liquidity.pool)}
        </Label>
      </Div>
      <div className="tw-my-4">
        <RewardPool
          user={props.user}
          txList={props.txList}
          isConnected={props.isConnected}
        />
      </div>

      {props.isConnected && (
        <>
          <h3 className="tw-w-full tw-text-center tw-mt-12 tw-mb-4">
            {t(translations.marketingPage.liquidity.miningEvent)}
          </h3>
          {data && data.length > 0 ? (
            <EventTable
              data={data || []}
              sov={true}
              totalAdded=""
              totalRemoved=""
              totalRemaining=""
            />
          ) : (
            <div className="tw-w-full tw-text-center tw-mt-12">
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
