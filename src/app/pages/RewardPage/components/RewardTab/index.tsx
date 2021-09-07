import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';

import { MainSection, Divider, PieChart } from '../../styled';
import { RewardClaimForm } from '../ClaimForms/RewardClaimForm';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail/index';
import { calculatePercentageDistribution } from './utils';
import { useGetAvailableTradingRewards } from './hooks/useGetAvailableTradingRewards';
import { useGetAvailableLiquidityRewards } from './hooks/useGetAvailableLiquidityRewards';
import { useGetAvailableLendingRewards } from './hooks/useGetAvailableLendingRewards';
import { useGetTotalTradingRewards } from './hooks/useGetTotalTradingRewards';
import { useGetTotalLiquidityRewards } from './hooks/useGetTotalLiquidityRewards';
import { useGetTotalLendingRewards } from './hooks/useGetTotalLendingRewards';

interface IRewardTabProps {
  amountToClaim: string;
}

export const RewardTab: React.FC<IRewardTabProps> = ({ amountToClaim }) => {
  const { t } = useTranslation();

  const availableTradingRewards = useGetAvailableTradingRewards();
  const availableLiquidityRewards = useGetAvailableLiquidityRewards();
  const availableLendingRewards = useGetAvailableLendingRewards();

  const totalTradingRewards = useGetTotalTradingRewards();
  const totalLiquidityRewards = useGetTotalLiquidityRewards();
  const totalLendingRewards = useGetTotalLendingRewards();

  const {
    lendingPercentage,
    tradingPercentage,
    liquidityPercentage,
  } = useMemo(
    () =>
      calculatePercentageDistribution(
        availableLendingRewards,
        availableTradingRewards,
        availableLiquidityRewards,
      ),
    [
      availableLendingRewards,
      availableLiquidityRewards,
      availableTradingRewards,
    ],
  );

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center">
      <MainSection>
        <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
          <RewardClaimForm amountToClaim={amountToClaim} />
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
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-green-2"></div>
                {tradingPercentage.toFixed(4)} % - Trading Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-primary"></div>
                {liquidityPercentage.toFixed(4)} % - Liquidity Rewards
              </div>
            </div>
          </div>
        </div>
      </MainSection>
      <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-8">
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.topData.tradingRewards)}
          availableAmount={availableTradingRewards}
          totalEarnedAmount={totalTradingRewards}
        />

        <RewardsDetail
          color={RewardsDetailColor.Green}
          title={t(translations.rewardPage.topData.lendingRewards)}
          availableAmount={availableLendingRewards}
          totalEarnedAmount={totalLendingRewards}
        />

        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.topData.liquidityRewards)}
          availableAmount={availableLiquidityRewards}
          totalEarnedAmount={totalLiquidityRewards}
        />
      </div>
    </div>
  );
};
