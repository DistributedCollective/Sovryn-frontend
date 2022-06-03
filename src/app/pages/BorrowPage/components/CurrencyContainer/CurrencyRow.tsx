import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';

import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { NextBorrowInterestRate } from 'app/components/NextBorrowInterestRate';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';

import styles from '../../index.module.scss';
import { LoanTokenGraphs } from '../../../../components/LoanTokenGraphs';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import classNames from 'classnames';

type Props = {
  lendingPool: LendingPool;
  lendingAmount: string;
  borrowAmount: string;
  active: boolean;
  onClick: MouseEventHandler;
};

const CurrencyRow: React.FC<Props> = ({
  lendingPool,
  lendingAmount,
  borrowAmount,
  active,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        styles.currencyContainer,
        'sovryn-border tw-overflow-hidden tw-pb-0 tw-pt-1 lg:tw-pt-2 tw-mb-4 tw-text-gray-6 tw-cursor-pointer',
        active && styles.active,
      )}
      onClick={onClick}
      data-action-id={`borrow-assetSelect-${lendingPool.getAsset()}`}
    >
      <div
        className={classNames(
          styles.currency,
          styles.currencyTitle,
          'tw-flex tw-flex- tw-justify-start tw-items-center lg:tw-w-3/6 tw-mb-4 lg:tw-mb-0 tw-px-4',
        )}
      >
        <StyledImage src={lendingPool.getAssetDetails().logoSvg} />
        <h3 className="tw-m-0 tw-pb-2">
          <AssetRenderer asset={lendingPool.getAsset()} />
        </h3>
      </div>
      <div
        className={classNames(
          styles.currency,
          'tw-flex tw-pt-0 tw-pb-4 lg:tw-pt-4',
        )}
      >
        <div className="tw-w-3/6 tw-px-4">
          <Text className="tw-text-gray-6">
            {t(translations.lend.currency.lendArp)}:
          </Text>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
          />
        </div>
        <div className="tw-w-3/6 tw-px-4">
          <Text className="tw-text-gray-6">
            {t(translations.lend.currency.borrowArp)}:
          </Text>
          <NextBorrowInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={borrowAmount}
          />
        </div>
      </div>
      {active && (
        <div>
          <LoanTokenGraphs lendingPool={lendingPool} />
        </div>
      )}
    </div>
  );
};

export default CurrencyRow;

const StyledImage = styled.img`
  width: 44px;
  height: 44px;
  object-fit: scale-down;
  margin-right: 11px;
`;
