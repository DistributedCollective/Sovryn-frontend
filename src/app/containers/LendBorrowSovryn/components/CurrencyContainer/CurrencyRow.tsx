import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import clsx from 'clsx';
import { Text } from '@blueprintjs/core';

import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { NextBorrowInterestRate } from 'app/components/NextBorrowInterestRate';
import { LendingPool } from 'utils/models/lending-pool';
import { translations } from 'locales/i18n';

import '../../assets/index.scss';
import './style.scss';
import { LoanTokenGraphs } from '../../../../components/LoanTokenGraphs';

type Props = {
  lendingPool: LendingPool;
  lendingAmount: string;
  borrowAmount: string;
  active: boolean;
};

const CurrencyRow: React.FC<Props> = ({
  lendingPool,
  lendingAmount,
  borrowAmount,
  active,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'sovryn-border px-3 py-1 py-lg-2 currency-container font-family-work-sans mb-3 text-muted',
        active && 'currency-container__active',
      )}
    >
      <div className="d-flex flex-row justify-content-start align-items-center currency currency-title w-lg-50 mb-3 mb-lg-0">
        <StyledImage src={lendingPool.getAssetDetails().logoSvg} />
        <h3 className="m-0 font-family-rowdies">{lendingPool.getName()}</h3>
      </div>
      <div className="d-flex currency w-lg-50">
        <div className="mr-3 w-50">
          <Text ellipsize className="text-muted">
            {t(translations.lend.currency.lendArp)}:
          </Text>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
          />
        </div>
        <div className="w-50">
          <Text ellipsize className="text-muted">
            {t(translations.lend.currency.borrowArp)}:
          </Text>
          <NextBorrowInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={borrowAmount}
          />
        </div>
      </div>
      {active && (
        <div className="mt-3">
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
