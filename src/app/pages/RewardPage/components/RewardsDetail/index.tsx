import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core';
import { weiToNumberFormat } from 'utils/display-text/format';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Asset } from 'types';
import { bignumber } from 'mathjs';
import { LoadableValue } from 'app/components/LoadableValue';

export enum RewardsDetailColor {
  Grey = 'grey',
  Green = 'green',
  Yellow = 'yellow',
}

interface IRewardsDetailProps {
  color: RewardsDetailColor;
  title: string;
  availableAmount: number | string;
  totalEarnedAmount: number | string;
  isInMainSection?: boolean;
  isComingSoon?: boolean;
  asset?: Asset;
  loading?: boolean;
  showApproximateSign?: boolean;
}

const getDetailColor = (color: RewardsDetailColor): string => {
  switch (color) {
    case RewardsDetailColor.Grey:
      return 'tw-bg-white';
    case RewardsDetailColor.Green:
      return 'tw-bg-green-2';
    case RewardsDetailColor.Yellow:
      return 'tw-bg-primary';
    default:
      return 'tw-bg-white';
  }
};

export const RewardsDetail: React.FC<IRewardsDetailProps> = ({
  color,
  title,
  availableAmount,
  totalEarnedAmount,
  isInMainSection,
  isComingSoon,
  asset = Asset.SOV,
  loading = false,
  showApproximateSign = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        !isInMainSection && styles.wrapper,
        isComingSoon && 'tw-cursor-not-allowed',
      )}
    >
      {isComingSoon && (
        <div className={styles.comingSoon}>
          {t(translations.rewardPage.comingSoon)}
        </div>
      )}
      <div className="tw-text-xl tw-font-medium tw-mb-8">{title}</div>

      <div className="tw-mb-6">
        <div className="tw-flex tw-items-center tw-mb-1.5">
          <div
            className={classNames(
              'tw-w-3 tw-h-3 tw-mr-4',
              getDetailColor(color),
            )}
          />
          <div className="tw-text-xs">
            {t(translations.rewardPage.availableRewards)}
          </div>
        </div>
        <div className="tw-ml-7 tw-text-xl tw-font-medium">
          <LoadableValue
            value={
              bignumber(availableAmount).greaterThan(0) ? (
                <Tooltip content={`${weiTo18(availableAmount)} ${asset}`}>
                  <>
                    {showApproximateSign && '≈ '}
                    {weiToNumberFormat(availableAmount, 6)}
                    <span className="tw-mr-1">...</span> {asset}
                  </>
                </Tooltip>
              ) : (
                <>0 {asset}</>
              )
            }
            loading={loading}
          />
        </div>
      </div>
      <div className="tw-ml-7 tw-text-gray-7">
        <div className={styles['secondary-title']}>
          {t(translations.rewardPage.totalRewards)}
        </div>
        <LoadableValue
          value={
            bignumber(totalEarnedAmount).greaterThan(0) ? (
              <Tooltip content={`${weiTo18(totalEarnedAmount)} ${asset}`}>
                <>
                  {showApproximateSign && '≈ '}
                  {weiToNumberFormat(totalEarnedAmount, 6)}
                  <span className="tw-mr-1">...</span> {asset}
                </>
              </Tooltip>
            ) : (
              <>0 {asset}</>
            )
          }
          loading={loading}
        />
      </div>
    </div>
  );
};
