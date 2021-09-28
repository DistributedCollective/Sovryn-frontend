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
          <div className={`tw-w-3 tw-h-3 tw-mr-4 ${getDetailColor(color)}`} />
          <div className="tw-text-xs">
            {t(translations.rewardPage.availableRewards)}
          </div>
        </div>
        <div className="tw-ml-7 tw-text-xl tw-font-medium">
          {bignumber(availableAmount).greaterThan(0) ? (
            <Tooltip content={`${weiTo18(availableAmount)} ${asset}`}>
              <>
                {weiToNumberFormat(availableAmount, 6)}{' '}
                <span className="tw--ml-1 tw-mr-1">...</span> {asset}
              </>
            </Tooltip>
          ) : (
            <>0 {asset}</>
          )}
        </div>
      </div>
      <div className={styles['secondary-section']}>
        <div className={styles['secondary-title']}>
          {t(translations.rewardPage.totalRewards)}
        </div>
        {bignumber(totalEarnedAmount).greaterThan(0) ? (
          <Tooltip content={`${weiTo18(totalEarnedAmount)} ${asset}`}>
            <>
              {weiToNumberFormat(totalEarnedAmount, 6)}{' '}
              <span className="tw--ml-1 tw-mr-1">...</span> {asset}
            </>
          </Tooltip>
        ) : (
          <>0 {asset}</>
        )}
      </div>
    </div>
  );
};
