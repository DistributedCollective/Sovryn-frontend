import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { min, bignumber } from 'mathjs';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { ActiveLoan } from '../../hooks/trading/useGetLoan';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { SendTxProgress } from '../../components/SendTxProgress';
import { TradeButton } from '../../components/TradeButton';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { DummyField } from '../../components/DummyField';
import { useApproveAndCloseWithDeposit } from '../../hooks/trading/useApproveAndCloseWithDeposit';
import { LoadableValue } from '../../components/LoadableValue';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { TxStatus } from 'store/global/transactions-store/types';
import { TINY_POSITION_AS_RBTC } from 'utils/classifiers';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { Asset } from 'types';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';

type RepayPositionFormProps = {
  loan: ActiveLoan;
};

export const RepayPositionForm: React.FC<RepayPositionFormProps> = ({
  loan,
}) => {
  const { t } = useTranslation();
  const canInteract = useIsConnected();
  const { checkMaintenance, States } = useMaintenance();
  const repayLocked = checkMaintenance(States.STOP_BORROW);
  const { asset } = AssetsDictionary.getByTokenContractAddress(loan.loanToken);
  const { asset: collateralAsset } = AssetsDictionary.getByTokenContractAddress(
    loan.collateralToken,
  );

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
  const valid = useIsAmountWithinLimits(
    weiAmount,
    '1',
    min(bignumber(balance), bignumber(loan.principal)),
  );

  const onMaxClicked = () => {
    setAmount(getMax());
  };

  const [receiveAmount, setReceiveAmount] = useState('0');

  useEffect(() => {
    if (bignumber(weiAmount).greaterThanOrEqualTo(loan.principal)) {
      setReceiveAmount(loan.collateral);
    } else {
      setReceiveAmount(
        bignumber(loan.collateral).mul(weiAmount).div(loan.principal).toFixed(),
      );
    }
  }, [weiAmount, loan.collateral, loan.principal]);

  const remainingPrincipal = useMemo(
    () => bignumber(loan.principal).minus(weiAmount).toFixed(0),
    [loan.principal, weiAmount],
  );
  const { value: remainingPrincipalAsRBTC } = useDenominateAssetAmount(
    asset,
    Asset.RBTC,
    remainingPrincipal,
  );

  const askToClosePosition = useMemo(() => {
    return (
      weiAmount !== '0' &&
      bignumber(loan.principal).gt(weiAmount) &&
      bignumber(TINY_POSITION_AS_RBTC).gte(remainingPrincipalAsRBTC)
    );
  }, [loan.principal, weiAmount, remainingPrincipalAsRBTC]);

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-relative">
      <h4 className="tw-text-long tw-text-center tw-mb-4 tw-uppercase">
        {t(translations.repayPositionForm.title)}
      </h4>

      <FieldGroup
        label={t(translations.repayPositionForm.labels.borrowedAmount)}
      >
        <DummyField>
          {weiTo18(loan.principal)}&nbsp;
          <span className="tw-text-gray-6"> {asset}</span>
        </DummyField>
      </FieldGroup>

      <FieldGroup
        label={t(translations.repayPositionForm.labels.amountToRepay, {
          currency: asset,
        })}
      >
        <AmountField
          value={amount || ''}
          onChange={value => setAmount(value)}
          onMaxClicked={onMaxClicked}
        />
        <small className="tw-text-gray-6">
          {t(translations.repayPositionForm.labels.amountToReceive)}
          {': '}
          <LoadableValue
            loading={false}
            value={weiTo4(receiveAmount)}
            tooltip={<>{weiTo18(receiveAmount)}</>}
          />{' '}
          {collateralAsset}
        </small>
      </FieldGroup>

      {askToClosePosition && (
        <ErrorBadge
          content={t(translations.repayPositionForm.tinyPositionError)}
        />
      )}

      <SendTxProgress displayAbsolute={false} {...closeTx} />

      <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
        <div className="tw-mb-4 lg:tw-mb-0">
          <AssetWalletBalance asset={asset} />
        </div>
        <TradeButton
          text={t(translations.repayPositionForm.button)}
          loading={closeTx.loading}
          disabled={
            closeTx.loading ||
            closeTx.status === TxStatus.PENDING_FOR_USER ||
            closeTx.status === TxStatus.PENDING ||
            !valid ||
            !canInteract ||
            repayLocked ||
            askToClosePosition
          }
          tooltip={
            repayLocked ? t(translations.maintenance.stopBorrow) : undefined
          }
          onClick={() => send()}
        />
      </div>
    </div>
  );
};
