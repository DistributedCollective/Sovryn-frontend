import { bignumber } from 'mathjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
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
import { ClaimForm } from '../ClaimForm';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail';

export function FeeForm() {
  const userAddress = useAccount();
  const { t } = useTranslation();
  const [liquidityRewards, setLiqRewards] = useState(0);
  const [lendingRewards, setLendingRewards] = useState(0);
  const rewardSov = useGetContractPastEvents('lockedSov', 'Deposited');
  const { value: stakingFee } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
  );
  // const { value:  referralFee} = useCacheCallWithValue(
  //   'affiliates',
  //   'getAffiliatesTokenRewardsValueInRbtc',
  //   userAddress,
  // );
  // console.log('value: ', lockedBalance);
  // useEffect(() => {
  //   }
  // }, [userAddress]);
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
            [[]]
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
