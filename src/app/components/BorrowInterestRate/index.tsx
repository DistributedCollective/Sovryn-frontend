/**
 *
 * BorrowInterestRate
 *
 */
import React from 'react';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { LoadableValue } from '../LoadableValue';
import { FieldGroup } from '../FieldGroup';
import { DummyField } from '../DummyField';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  value: string;
  loading: boolean;
  labelColor: string;
}

export function BorrowInterestRate({ value, loading, labelColor }: Props) {
  const { t } = useTranslation();
  return (
    <FieldGroup
      label={t(translations.global.interestApr)}
      labelColor={labelColor}
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
