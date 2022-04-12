import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { DummyField } from '../../../../components/DummyField';
import { useApproveAndAddMargin } from '../../../../hooks/trading/useApproveAndAndMargin';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, MAINTENANCE_MARGIN } from 'utils/classifiers';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import { usePositionLiquidationPrice } from '../../../../hooks/trading/usePositionLiquidationPrice';
import { toAssetNumberFormat } from 'utils/display-text/format';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { LoadableValue } from 'app/components/LoadableValue';

type AddCollateralModalProps = {
  loan: ActiveLoan;
  onCloseModal: () => void;
  liquidationPrice?: React.ReactNode;
  positionSize?: string;
};

export const AddCollateralModal: React.FC<AddCollateralModalProps> = ({
  loan: item,
  onCloseModal,
}) => {
  console.log('loan', item);

  const canInteract = useCanInteract();
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    item?.collateralToken || '',
  );
  const loanToken = AssetsDictionary.getByTokenContractAddress(
    item?.loanToken || '',
  );
  const [amount, setAmount] = useState('');
  const { value: balance } = useAssetBalanceOf(tokenDetails.asset);
  const weiAmount = useWeiAmount(amount);

  const { send, ...tx } = useApproveAndAddMargin(
    tokenDetails.asset,
    item.loanId,
    weiAmount,
  );
  const { checkMaintenance, States } = useMaintenance();
  const topupLocked = checkMaintenance(States.ADD_TO_MARGIN_TRADES);

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);
  const { t } = useTranslation();

  const currentLiquidationPrice = usePositionLiquidationPrice(
    item.principal,
    bignumber(item.collateral).toString(),
    TradingPosition.SHORT,
    MAINTENANCE_MARGIN,
  );

  const liquidationPrice = usePositionLiquidationPrice(
    item.principal,
    bignumber(item.collateral).add(weiAmount).toString(),
    TradingPosition.SHORT,
    MAINTENANCE_MARGIN,
  );

  const {
    value: principalAsCollateral,
    loading: loadingRate,
  } = useDenominateAssetAmount(
    loanToken.asset,
    tokenDetails.asset,
    item.principal,
  );

  const collateralRatio = useMemo(
    () =>
      bignumber(principalAsCollateral).div(item.collateral).mul(100).toFixed(3),
    [item.collateral, principalAsCollateral],
  );

  return (
    <>
      <div className="tw-mw-340 tw-mx-auto">
        <h1 className="tw-text-sov-white tw-text-center">
          {t(translations.addCollateral.title)}
        </h1>

        <div className="tw-py-4 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
          <LabelValuePair
            label={t(translations.addCollateral.collateralBalance)}
            value={
              <>
                {weiToAssetNumberFormat(item.collateral, tokenDetails.asset)}{' '}
                <AssetRenderer asset={tokenDetails.asset} />
              </>
            }
          />
          <LabelValuePair
            label={t(translations.addCollateral.liquidationPrice)}
            value={
              <>
                {weiToAssetNumberFormat(
                  currentLiquidationPrice,
                  tokenDetails.asset,
                )}{' '}
                <AssetRenderer asset={tokenDetails.asset} />
              </>
            }
          />
          <LabelValuePair
            label={t(translations.addCollateral.collateralRatio)}
            value={
              <LoadableValue
                loading={loadingRate}
                value={<>{collateralRatio} %</>}
              />
            }
          />
        </div>

        <FormGroup
          label={t(translations.addCollateral.amount)}
          className="tw-mb-6"
        >
          <AmountInput
            onChange={setAmount}
            value={amount}
            asset={tokenDetails.asset}
            showBalance={true}
          />
        </FormGroup>

        <FormGroup
          label={t(translations.addToMargin.liquidationPrice)}
          className="tw-mb-5"
        >
          <DummyField>
            {toAssetNumberFormat(liquidationPrice, tokenDetails.asset)}{' '}
            <AssetRenderer asset={tokenDetails.asset} />
          </DummyField>
        </FormGroup>

        <div className="tw-text-sm tw-mb-3">
          <TxFeeCalculator
            args={[item.loanId, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />
        </div>

        {topupLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.addToMarginTrades}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                  >
                    x
                  </a>,
                ]}
              />
            }
          />
        )}
        <DialogButton
          confirmLabel={t(translations.common.confirm)}
          onConfirm={send}
          disabled={topupLocked || tx.loading || !valid || !canInteract}
        />
      </div>
      <TransactionDialog
        fee={
          <TxFeeCalculator
            args={[item.loanId, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />
        }
        tx={tx}
        onUserConfirmed={onCloseModal}
      />
    </>
  );
};
