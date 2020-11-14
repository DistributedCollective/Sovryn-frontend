/**
 *
 * RepayPositionForm
 *
 */

import React, { useCallback, useState } from 'react';
import { min, bignumber } from 'mathjs';
import { useAccount } from '../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { ActiveLoan } from '../../hooks/trading/useGetLoan';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { SendTxProgress } from '../../components/SendTxProgress';
import { TradeButton } from '../../components/TradeButton';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { weiTo18, weiTo4 } from '../../../utils/blockchain/math-helpers';
import { DummyField } from '../../components/DummyField';
import { useApproveAndCloseWithDeposit } from '../../hooks/trading/useApproveAndCloseWithDeposit';
import { useCanInteract } from '../../hooks/useCanInteract';

interface Props {
  loan: ActiveLoan;
}

export function RepayPositionForm({ loan }: Props) {
  const canInteract = useCanInteract();
  const { asset } = AssetsDictionary.getByTokenContractAddress(loan.loanToken);

  const { value: balance } = useAssetBalanceOf(asset);

  const getMax = useCallback(() => {
    return weiTo18(min(bignumber(loan.principal), bignumber(balance)));
  }, [loan.principal, balance]);

  const receiver = useAccount();

  const [amount, setAmount] = useState<string>('');
  const weiAmount = useWeiAmount(amount);

  const { send, ...closeTx } = useApproveAndCloseWithDeposit(
    asset,
    AssetsDictionary.getByTokenContractAddress(loan.collateralToken).asset,
    loan.loanId,
    receiver,
    weiAmount,
  );
  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);

  const onMaxClicked = () => {
    setAmount(getMax());
  };

  return (
    <div className="container position-relative">
      <h4 className="text-teal text-center mb-3 text-uppercase">Repay loan</h4>

      <FieldGroup label="Borrowed Amount">
        <DummyField>
          {weiTo4(loan.principal)} <span className="text-muted">{asset}</span>
        </DummyField>
      </FieldGroup>

      <FieldGroup label="Amount to repay">
        <AmountField
          value={amount || ''}
          onChange={value => setAmount(value)}
          onMaxClicked={onMaxClicked}
        />
      </FieldGroup>

      <SendTxProgress displayAbsolute={false} {...closeTx} />

      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
        <div className="mb-3 mb=lg-0">
          <AssetWalletBalance asset={asset} />
        </div>
        <TradeButton
          text="Repay"
          loading={closeTx.loading}
          disabled={closeTx.loading || !valid || !canInteract}
          onClick={() => send()}
        />
      </div>
    </div>
  );
}
