import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios, { Canceler } from 'axios';

import { translations } from 'locales/i18n';

import { RewardTable, WeekRewardType } from './RewardTable';

export interface Props {
  isConnected: boolean;
  txList: Array<any>;
  user: string;
  rate: number;
}

export function RewardPool(props: Props) {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [data, setData] = useState<WeekRewardType[]>([]);
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    if (props.user) {
      cancelDataRequest.current && cancelDataRequest.current();

      const cancelToken = new axios.CancelToken(c => {
        cancelDataRequest.current = c;
      });

      axios
        .get(api + '/amm/liquidity-mining/sov-calc/' + props.user, {
          cancelToken,
        })
        .then(res => {
          const { week1, week2, week3, week4 } = res.data;
          const now = new Date();
          const weeks: WeekRewardType[] = [];
          if (now.getTime() - new Date(week1.weekStart).getTime() > 0) {
            weeks.push({ ...week1, rewardPool: 30000 });
          }
          if (now.getTime() - new Date(week2.weekStart).getTime() > 0) {
            weeks.push({ ...week2, rewardPool: 15000 });
          }
          if (now.getTime() - new Date(week3.weekStart).getTime() > 0) {
            weeks.push({ ...week3, rewardPool: 15000 });
          }
          if (now.getTime() - new Date(week4.weekStart).getTime() > 0) {
            weeks.push({ ...week4, rewardPool: 15000 });
          }
          setData(weeks);
        })
        .catch(e => console.error(e));
    }
  }, [api, props.user]);

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, props.rate * 1e3);
    return () => {
      clearInterval(interval);
      cancelDataRequest.current && cancelDataRequest.current();
    };
  }, [getData, props.rate]);

  return (
    <div className="tw-w-2/3 wt-mx-auto">
      {props.isConnected && (
        <>
          <h3 className="tw-w-full tw-text-center tw-mt-12 tw-mb-4">
            {t(translations.marketingPage.liquidity.rewardPool)}
          </h3>
          {data && data.length > 0 ? (
            <div className="tw-w-full tw-text-center">
              <RewardTable data={data || []} />
              {t(translations.marketingPage.liquidity.rewardPoolNote)}
            </div>
          ) : (
            <div className="tw-w-full tw-text-center tw-mt-12">
              {t(translations.marketingPage.liquidity.noAsset, {
                asset: 'SOV/RBTC',
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

RewardPool.defaultProps = {
  rate: 60,
};
