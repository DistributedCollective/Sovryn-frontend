import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import axios from 'axios';

import { translations } from 'locales/i18n';

import { RewardTable, WeekRewardType } from './RewardTable';

export interface Props {
  isConnected: boolean;
  txList: Array<any>;
  user: string;
}

export function RewardPool(props: Props) {
  const { t } = useTranslation();
  const api = backendUrl[currentChainId];
  const [data, setData] = useState<WeekRewardType[]>([]);

  useEffect(() => {
    if (props.user) {
      axios
        .get(api + 'amm/liquidity-mining/sov-calc/' + props.user)
        .then(res => {
          const { week1, week2, week3, week4 } = res.data;
          const now = new Date();
          const weeks: WeekRewardType[] = [];
          if (now.getTime() - new Date(week1.weekStart).getTime()) {
            weeks.push(week1);
          }
          if (now.getTime() - new Date(week2.weekStart).getTime()) {
            weeks.push(week2);
          }
          if (now.getTime() - new Date(week3.weekStart).getTime()) {
            weeks.push(week3);
          }
          if (now.getTime() - new Date(week4.weekStart).getTime()) {
            weeks.push(week4);
          }
          setData(weeks);
        })
        .catch(e => console.error(e));
    }
  }, [api, props.user]);

  return (
    <div className="col-8 mx-auto">
      {props.isConnected && (
        <>
          <h3 className="w-100 text-center mt-5 mb-3">
            {t(translations.marketingPage.liquidity.rewardPool)}
          </h3>
          {data && data.length > 0 ? (
            <RewardTable data={data || []} />
          ) : (
            <div className="w-100 text-center mt-5">
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
