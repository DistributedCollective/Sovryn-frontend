import axios from 'axios';
import { bignumber } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

import { ethGenesisAddress } from '../../../../../utils/classifiers';
import { LiquidityPoolDictionary } from '../../../../../utils/dictionaries/liquidity-pool-dictionary';
import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { bridgeNetwork } from '../../../BridgeDepositPage/utils/bridge-network';
import {
  Box,
  ContainerBox,
  Divider,
  PieChart,
  RewardDetailsWrapper,
} from '../../styled';
import { RewardClaimForm } from '../ClaimForms/RewardClaimForm';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail/index';
import { calculatePercentageDistribution } from './utils';

interface IRewardFormProps {
  amountToClaim: string;
}

export const RewardForm: React.FC<IRewardFormProps> = ({ amountToClaim }) => {
  const userAddress = useAccount();
  const { t } = useTranslation();
  const [liquidityRewards, setLiquidityRewards] = useState('0');
  const [lendingRewards, setLendingRewards] = useState('0');
  const url = backendUrl[currentChainId];
  const [tradeRewards, setTradeRewards] = useState('0');

  useEffect(() => {
    axios
      .get(`${url}/v1/event-history/availableTradingRewards/${userAddress}`)
      .then(res => {
        const { events } = res.data;
        setTradeRewards(events[0].sum);
      })
      .catch(error => console.log(error));
  }, [url, userAddress]);

  useEffect(() => {
    const ammPools = LiquidityPoolDictionary.list().filter(
      item => item.hasSovRewards,
    );
    const lendingPools = LendingPoolDictionary.list().filter(
      item => item.useLM,
    );

    if (userAddress !== '' && userAddress !== ethGenesisAddress) {
      const pools = ammPools.flatMap(item =>
        item.version === 1
          ? [item.supplyAssets[0]]
          : [item.supplyAssets[0], item.supplyAssets[1]],
      );
      bridgeNetwork
        .multiCall<{ [key: string]: string }>(
          Chain.RSK,
          pools.flatMap((item, index) => {
            return [
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserAccumulatedReward',
                args: [item.getContractAddress(), userAddress],
                key: `getUserAccumulatedReward_${index}_${item.asset}`,
                parser: value => value[0].toString(),
              },
            ];
          }),
        )
        .then(result => {
          const total = Object.values(result.returnData).reduce(
            (previousValue, currentValue) => previousValue.add(currentValue),
            bignumber(0),
          );
          setLiquidityRewards(total.toString());
        })
        .catch(error => {
          console.error('e', error);
        });

      bridgeNetwork
        .multiCall<{ [key: string]: string }>(
          Chain.RSK,
          lendingPools.flatMap((item, index) => {
            return [
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserAccumulatedReward',
                args: [
                  item.getAssetDetails().lendingContract.address,
                  userAddress,
                ],
                key: `getUserAccumulatedReward_${index}_${item.getAsset}`,
                parser: value => value[0].toString(),
              },
            ];
          }),
        )
        .then(result => {
          const total = Object.values(result.returnData).reduce(
            (previousValue, currentValue) => previousValue.add(currentValue),
            bignumber(0),
          );
          setLendingRewards(total.toString());
        })
        .catch(error => {
          console.error('e', error);
        });
    }
  }, [userAddress]);

  // Lending Rewards - Total Rewards Earned
  const { events: lendingRewardEvents } = useGetContractPastEvents(
    'lockedSov',
    'Deposited',
  );

  const lendTotalRewardsEarned = useMemo(
    () =>
      lendingRewardEvents
        .map(item => item.returnValues.sovAmount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [lendingRewardEvents],
  );

  // Liquidity Rewards - Total Rewards Earned
  const { events: liquidityRewardsEvents } = useGetContractPastEvents(
    'liquidityMiningProxy',
    'RewardClaimed',
  );

  const liquidityMiningTotalRewardsEarned = useMemo(
    () =>
      liquidityRewardsEvents
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [liquidityRewardsEvents],
  );

  // Trading Rewards - Total Rewards Earned
  const { events: tradingRewardsEvents } = useGetContractPastEvents(
    'sovrynProtocol',
    'EarnReward',
  );

  const tradingTotalRewardsEarned = useMemo(
    () =>
      tradingRewardsEvents
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [tradingRewardsEvents],
  );

  const {
    lendingPercentage,
    tradingPercentage,
    liquidityPercentage,
  } = useMemo(
    () =>
      calculatePercentageDistribution(
        lendingRewards,
        tradeRewards,
        liquidityRewards,
      ),
    [lendingRewards, liquidityRewards, tradeRewards],
  );

  return (
    <ContainerBox>
      <Box>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <RewardClaimForm
            address={userAddress}
            amountToClaim={amountToClaim}
          />
        </div>
        <Divider />
        <div className="tw-w-1/2">
          <div className="tw-flex tw-items-center tw-justify-evenly">
            <PieChart
              firstPercentage={lendingPercentage}
              secondPercentage={tradingPercentage}
              thirdPercentage={liquidityPercentage}
            />
            <div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-white"></div>
                {lendingPercentage.toFixed(4)} % - Lending Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-green"></div>
                {tradingPercentage.toFixed(4)} % - Trading Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-gold"></div>
                {liquidityPercentage.toFixed(4)} % - Liquidity Rewards
              </div>
            </div>
          </div>
        </div>
      </Box>
      <RewardDetailsWrapper>
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.topData.tradingRewards)}
          availableAmount={tradeRewards}
          totalEarnedAmount={tradingTotalRewardsEarned}
        />

        <RewardsDetail
          color={RewardsDetailColor.Green}
          title={t(translations.rewardPage.topData.lendingRewards)}
          availableAmount={lendingRewards}
          totalEarnedAmount={lendTotalRewardsEarned}
        />

        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.topData.liquidityRewards)}
          availableAmount={liquidityRewards}
          totalEarnedAmount={liquidityMiningTotalRewardsEarned}
        />
      </RewardDetailsWrapper>
    </ContainerBox>
  );
};
