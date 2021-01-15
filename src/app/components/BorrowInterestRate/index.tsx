/**
 *
 * BorrowInterestRate
 *
 */
import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useLending_nextBorrowInterestRate } from 'app/hooks/trading/useLending_nextBorrowInterestRate';
import { usePriceFeeds_QueryRate } from 'app/hooks/price-feeds/useQueryRate';
import { LoadableValue } from '../LoadableValue';
import { FieldGroup } from '../FieldGroup';
import { DummyField } from '../DummyField';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  asset: Asset;
  collateral: Asset;
  leverage: number;
  weiAmount: string;
  labelColor: string;
}

export function BorrowInterestRate(props: Props) {
  const { t } = useTranslation();
  const { value: result } = usePriceFeeds_QueryRate(
    props.collateral,
    props.asset,
  );

  const [totalDeposit, setTotalDeposit] = useState('0');
  const [borrowAmount, setBorrowAmount] = useState(totalDeposit);

  // Calculate loan tokens we depositing.
  useEffect(() => {
    let _totalDeposit = '0'; // loanTo
    // let totalDeposit = props.loanTokenSent;

    if (props.weiAmount !== '0') {
      // props.collateralTokenSent != '0'
      if (result.rate !== '0') {
        _totalDeposit = bignumber(props.weiAmount)
          .mul(result.rate)
          .div(result.precision)
          .add(_totalDeposit)
          .toFixed(0);
      }
    }
    setTotalDeposit(_totalDeposit);
    // eslint-disable-next-line
  }, [JSON.stringify(result), props]);

  useEffect(() => {
    setBorrowAmount(
      bignumber(totalDeposit)
        .mul(props.leverage - 1)
        .toFixed(0),
    );
  }, [totalDeposit, props.leverage]);

  const { value, loading } = useLending_nextBorrowInterestRate(
    props.asset,
    borrowAmount,
  );

  return (
    <FieldGroup
      label={t(translations.global.interestApr)}
      labelColor={props.labelColor}
    >
      <DummyField>
        <LoadableValue
          value={
            <>
              {weiToFixed(value, 2)} <span className="text-muted">%</span>
            </>
          }
          loading={loading}
        />
      </DummyField>
    </FieldGroup>
  );
}

BorrowInterestRate.defaultProps = {
  labelColor: 'var(--dark-gray)',
};
