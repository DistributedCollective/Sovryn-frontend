import React, { useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types/asset';
import { weiTo18, weiTo4 } from '../../../../../utils/blockchain/math-helpers';
import { FieldGroup } from '../../../../components/FieldGroup';
import { LoadableValue } from '../../../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { ArrowDown } from '../../../BuySovPage/components/ArrowStep/down';
import { Input } from 'app/pages/BuySovPage/components/Input';
import { AmountButton } from '../../../BuySovPage/components/AmountButton';
import { Button } from '../Button';
import { useApproveAndDepositToken } from '../../hooks/useApproveAndDepositToken';
import { TxDialog } from './TxDialog';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';

export function EscrowForm() {
  const { t } = useTranslation();

  const connected = useCanInteract(true);

  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);

  const { value: balance, loading: loadingBalance } = useAssetBalanceOf(
    Asset.SOV,
  );

  const contractStatus = useCacheCallWithValue('escrowRewards', 'status', '0');
  const totalDeposit = useCacheCallWithValue(
    'escrowRewards',
    'totalDeposit',
    '0',
  );
  const depositLimit = useCacheCallWithValue(
    'escrowRewards',
    'depositLimit',
    '0',
  );

  const reward = useMemo(() => {
    return bignumber(weiAmount)
      .mul(5 / 100)
      .add(weiAmount)
      .toFixed(0);
  }, [weiAmount]);

  const { deposit, ...tx } = useApproveAndDepositToken(weiAmount);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(balance) &&
      contractStatus.value === '1' &&
      bignumber(depositLimit.value).greaterThanOrEqualTo(
        bignumber(totalDeposit.value).add(weiAmount),
      )
    );
  }, [
    weiAmount,
    balance,
    contractStatus.value,
    depositLimit.value,
    totalDeposit.value,
  ]);

  const changeAmount = value => {
    if (value === 100) {
      setAmount(weiTo4(balance));
    } else {
      setAmount(
        weiTo4(
          bignumber(balance)
            .mul(value / 100)
            .toFixed(0),
        ),
      );
    }
  };

  return (
    <>
      <Container className="d-block flex-shrink-0 bg-black d-flex flex-column justify-content-start align-items-center flex-grow-0 flex-shrink-0">
        <div className="w-100 px-0 px-lg-4">
          <FieldGroup
            label={t(translations.buySovPage.form.enterAmount)}
            labelColor="#E9EAE9"
          >
            <Input
              value={amount}
              type="text"
              onChange={value => setAmount(value)}
              placeholder="0.0000"
              rightElement="SOV"
            />
            <Slippage>
              {t(translations.buySovPage.form.availableBalance)}{' '}
              <LoadableValue
                loading={loadingBalance}
                value={weiToNumberFormat(balance, 4)}
                tooltip={weiTo18(balance)}
              />{' '}
              SOV
            </Slippage>
            <AmountButton onChange={changeAmount} />
          </FieldGroup>

          <ArrowDown />

          <FieldGroup
            label={t(translations.escrowPage.form.reward)}
            labelColor="#E9EAE9"
          >
            <Dummy className="d-flex justify-content-between align-items-center">
              <div className="w-100 text-center">
                {weiToNumberFormat(reward, 4)}
              </div>
              <div>SOV</div>
            </Dummy>
          </FieldGroup>

          <div className="mt-5" />

          <Button
            disabled={tx.loading || !validate || !connected}
            text={t(translations.escrowPage.form.cta)}
            onClick={() => deposit()}
          />
        </div>
      </Container>

      <TxDialog tx={tx} />
    </>
  );
}

const Slippage = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Dummy = styled.div`
  border: 1px solid #575757;
  color: #e9eae9;
  height: 40px;
  padding: 11px 21px;
  font-weight: 500;
  border-radius: 10px;
  line-height: 1;
`;

const Container = styled.article`
  width: 450px;
  min-height: 360px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 20px;
  padding: 30px 65px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
