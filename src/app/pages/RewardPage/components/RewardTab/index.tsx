import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PieChart } from '../../styled';
import styles from '../../index.module.scss';
import { RewardClaimForm } from '../ClaimForms/RewardClaimForm';
import { RewardsDetail, RewardsDetailColor } from '../RewardsDetail/index';
import { calculatePercentageDistribution } from './utils';
import { useGetTotalTradingRewards } from './hooks/useGetTotalTradingRewards';
import { useGetTotalLiquidityRewards } from './hooks/useGetTotalLiquidityRewards';
import { useGetTotalLendingRewards } from './hooks/useGetTotalLendingRewards';
import { bignumber } from 'mathjs';
import { NoRewardInfo } from '../../components/NoRewardInfo/index';
import imgNoClaim from 'assets/images/reward/ARMANDO__LENDING.svg';
import classNames from 'classnames';

interface IRewardTabProps {
  availableTradingRewards: string;
  availableLiquidityRewards: string;
  availableLendingRewards: string;
  amountToClaim: string;
}

export const RewardTab: React.FC<IRewardTabProps> = ({
  availableTradingRewards,
  availableLiquidityRewards,
  availableLendingRewards,
  amountToClaim,
}) => {
  const { t } = useTranslation();
  const totalTradingRewards = useGetTotalTradingRewards();
  const totalLiquidityRewards = useGetTotalLiquidityRewards();
  const { data } = useGetTotalLendingRewards();

  const totalLendingRewards = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.rewardsEarnedHistoryItems.reduce(
      (previousItem, currentItem) => previousItem.add(currentItem.amount),
      bignumber(0),
    );
  }, [data]);

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
      <div className={styles['tab-main-section']}>
        {bignumber(amountToClaim).equals(0) ? (
          <NoRewardInfo image={imgNoClaim} text={<NoRewardInfoText />} />
        ) : (
          <>
            <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
              <RewardClaimForm amountToClaim={amountToClaim} />
            </div>
            <div className={styles.divider} />
            <div className="tw-w-1/2">
              <div className="tw-flex tw-items-center tw-justify-evenly">
                <PieChart
                  firstPercentage={tradingPercentage}
                  secondPercentage={lendingPercentage}
                  thirdPercentage={liquidityPercentage}
                />
                <div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-white"></div>
                    {tradingPercentage.toFixed(4)} % -{' '}
                    {t(translations.rewardPage.tradingRewards)}
                  </div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center tw-mb-5">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-green-2"></div>
                    {lendingPercentage.toFixed(4)} % -{' '}
                    {t(translations.rewardPage.lendingRewards)}
                  </div>
                  <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                    <div className="tw-w-3 tw-h-3 tw-mr-4 tw-bg-primary"></div>
                    {liquidityPercentage.toFixed(4)} % -{' '}
                    {t(translations.rewardPage.liquidityRewards)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center tw-mt-8">
        <RewardsDetail
          color={RewardsDetailColor.Grey}
          title={t(translations.rewardPage.tradingRewards)}
          availableAmount={availableTradingRewards}
          totalEarnedAmount={totalTradingRewards}
        />

        <RewardsDetail
          color={RewardsDetailColor.Green}
          title={t(translations.rewardPage.lendingRewards)}
          availableAmount={availableLendingRewards}
          totalEarnedAmount={bignumber(totalLendingRewards)
            .add(availableLendingRewards)
            .toString()}
        />

        <RewardsDetail
          color={RewardsDetailColor.Yellow}
          title={t(translations.rewardPage.liquidityRewards)}
          availableAmount={availableLiquidityRewards}
          totalEarnedAmount={bignumber(totalLiquidityRewards)
            .add(availableLiquidityRewards)
            .toString()}
        />
      </div>
    </div>
  );
};

const NoRewardInfoText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-text-xl tw-font-medium tw-mb-5 tw-tracking-normal">
        {t(translations.rewardPage.noRewardInfoText.rewardSovTab.title)}
      </div>
      <div className="tw-text-xs tw-tracking-normal tw-font-normal tw-mb-5">
        {t(
          translations.rewardPage.noRewardInfoText.rewardSovTab
            .recommendationsTitle,
        )}
      </div>
      <div className="tw-text-sm">
        <div className={classNames(styles.ul, 'tw-mb-4')}>
          {t(
            translations.rewardPage.noRewardInfoText.rewardSovTab
              .recommendation1,
          )}
        </div>
        <div className={classNames(styles.ul, 'tw-mb-4')}>
          {t(
            translations.rewardPage.noRewardInfoText.rewardSovTab
              .recommendation2,
          )}
        </div>
        <div className={styles.ul}>
          {t(
            translations.rewardPage.noRewardInfoText.rewardSovTab
              .recommendation3,
          )}
        </div>
      </div>
    </>
  );
};
