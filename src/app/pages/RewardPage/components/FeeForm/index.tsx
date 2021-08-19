import { bignumber } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { ethGenesisAddress } from '../../../../../utils/classifiers';
import { LiquidityPoolDictionary } from '../../../../../utils/dictionaries/liquidity-pool-dictionary';
import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { bridgeNetwork } from '../../../BridgeDepositPage/utils/bridge-network';
import { ClaimForm } from '../ClaimForm';
import {
  Box,
  ContainerBox,
  Divider,
  PieChart,
  RewardDetailsWrapper,
} from '../../styled';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';

export function FeeForm() {
  const userAddress = useAccount();
  const { t } = useTranslation();
  const [liquidityRewards, setLiqRewards] = useState(0);
  const [lendingRewards, setLendingRewards] = useState(0);
  const rewardSov = useGetContractPastEvents('lockedSov', 'Deposited');
  console.log('rewardSov: ', rewardSov);
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
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserInfo',
                args: [item.getContractAddress(), userAddress],
                key: `getUserInfo_${index}_${item.asset}`,
                parser: value => value[0].accumulatedReward.toString(),
              },
            ];
          }),
        )
        .then(result => {
          console.log('result', result);
          const total = Object.values(result.returnData)
            .reduce(
              (previousValue, currentValue) => previousValue.add(currentValue),
              bignumber(0),
            )
            .toFixed(0);
          const rewards = parseFloat(weiTo18(total));
          setLiqRewards(rewards);
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
          const total = Object.values(result.returnData)
            .reduce(
              (previousValue, currentValue) => previousValue.add(currentValue),
              bignumber(0),
            )
            .toFixed(0);
          const rewards = parseFloat(weiTo18(total));
          setLendingRewards(rewards);
        })
        .catch(error => {
          console.error('e', error);
        });
    }
  }, [userAddress]);
  return (
    <ContainerBox>
      <Box>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <ClaimForm address={userAddress} />
        </div>
        <Divider />
        <div className="tw-w-1/2">
          <div className="tw-flex tw-items-center tw-justify-evenly">
            <PieChart
              firstPercentage={10}
              secondPercentage={40}
              thirdPercentage={50}
            />
            <div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-white"></div>
                10% - Lending Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-green"></div>
                40% - Trading Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-gold"></div>
                50% - Liquidity Rewards
              </div>
            </div>
          </div>
        </div>
      </Box>
      <RewardDetailsWrapper>
        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.fee.stakingFee)}
          availableAmount={liquidityRewards.toFixed(6)}
          totalEarnedAmount={73.5927}
        />

        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.fee.referralFee)}
          availableAmount={lendingRewards.toFixed(6)}
          totalEarnedAmount={73.5927}
        />

        <RewardsDetail
          color={RewardsDetailColor.Green}
          title={t(translations.rewardPage.fee.tradingRebate)}
          availableAmount={15.2976}
          totalEarnedAmount={73.5927}
        />
      </RewardDetailsWrapper>
    </ContainerBox>
  );
}
