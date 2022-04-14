import React, { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TransactionDialog } from 'app/components/TransactionDialog';
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
import { discordInvite } from 'utils/classifiers';
import {
  toAssetNumberFormat,
  weiToAssetNumberFormat,
} from 'utils/display-text/format';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { LoadableValue } from 'app/components/LoadableValue';
import {
  BORROW_MAINTENANCE_RATIO,
  calculateCollateralRatio,
  calculateLiquidationPrice,
} from './utils';

type AddCollateralModalProps = {
  loan: ActiveLoan;
  onCloseModal: () => void;
  liquidationPrice?: React.ReactNode;
  positionSize?: string;
};

enum Step {
  FORM,
  REVIEW,
}

export const AddCollateralModal: React.FC<AddCollateralModalProps> = ({
  loan: item,
}) => {
  const canInteract = useCanInteract();
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    item?.collateralToken || '',
  );
  const loanToken = AssetsDictionary.getByTokenContractAddress(
    item?.loanToken || '',
  );
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(Step.FORM);
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

  const {
    value: principalAsCollateral,
    loading: loadingRate,
  } = useDenominateAssetAmount(
    loanToken.asset,
    tokenDetails.asset,
    item.principal,
  );

  const currentCollateralRatio = useMemo(
    () => calculateCollateralRatio(principalAsCollateral, item.collateral),
    [item.collateral, principalAsCollateral],
  );

  const currentLiquidationPrice = useMemo(
    () =>
      calculateLiquidationPrice(
        item.principal,
        item.collateral,
        BORROW_MAINTENANCE_RATIO,
      ),
    [item.collateral, item.principal],
  );

  const newCollateralAmount = useMemo(
    () => bignumber(item.collateral).add(weiAmount).toFixed(0),
    [item.collateral, weiAmount],
  );

  const newLiquidationPrice = useMemo(
    () =>
      calculateLiquidationPrice(
        item.principal,
        bignumber(item.collateral).add(weiAmount).toString(),
        BORROW_MAINTENANCE_RATIO,
      ),
    [item.collateral, item.principal, weiAmount],
  );

  const newCollateralRatio = useMemo(
    () =>
      calculateCollateralRatio(
        principalAsCollateral,
        bignumber(item.collateral).add(weiAmount).toString(),
      ),
    [item.collateral, principalAsCollateral, weiAmount],
  );

  const handleNextStep = useCallback(() => setStep(Step.REVIEW), []);

  return (
    <>
      <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
        {step === Step.FORM && (
          <>
            <h1 className="tw-text-sov-white tw-text-center">
              {t(translations.addCollateral.title)}
            </h1>

            <div className="tw-py-4 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
              <LabelValuePair
                label={t(translations.addCollateral.collateralBalance)}
                value={
                  <>
                    {weiToAssetNumberFormat(
                      item.collateral,
                      tokenDetails.asset,
                    )}{' '}
                    <AssetRenderer asset={tokenDetails.asset} />
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.addCollateral.liquidationPrice)}
                value={
                  <>
                    {toAssetNumberFormat(
                      currentLiquidationPrice,
                      loanToken.asset,
                    )}{' '}
                    <AssetRenderer asset={loanToken.asset} />
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.addCollateral.collateralRatio)}
                value={
                  <LoadableValue
                    loading={loadingRate}
                    value={<>{currentCollateralRatio} %</>}
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

            {!valid && Number(weiAmount) > 0 && (
              <ErrorBadge
                content={t(translations.addCollateral.errors.balance, {
                  asset: tokenDetails.asset,
                })}
              />
            )}

            <FormGroup
              label={t(translations.addCollateral.newInfo)}
              className="tw-mb-6"
            >
              <div className="tw-py-4 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
                <LabelValuePair
                  label={t(translations.addCollateral.collateralBalance)}
                  value={
                    <>
                      {weiToAssetNumberFormat(
                        newCollateralAmount,
                        tokenDetails.asset,
                      )}{' '}
                      <AssetRenderer asset={tokenDetails.asset} />
                    </>
                  }
                />
                <LabelValuePair
                  label={t(translations.addCollateral.liquidationPrice)}
                  value={
                    <>
                      {toAssetNumberFormat(
                        newLiquidationPrice,
                        loanToken.asset,
                      )}{' '}
                      <AssetRenderer asset={loanToken.asset} />
                    </>
                  }
                />
                <LabelValuePair
                  label={t(translations.addCollateral.collateralRatio)}
                  value={
                    <LoadableValue
                      loading={loadingRate}
                      value={<>{newCollateralRatio} %</>}
                    />
                  }
                />
              </div>
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
              confirmLabel={t(translations.common.continue)}
              onConfirm={handleNextStep}
              disabled={topupLocked || tx.loading || !valid || !canInteract}
            />
          </>
        )}

        {step === Step.REVIEW && (
          <>
            <h1 className="tw-text-sov-white tw-text-center">
              {t(translations.addCollateral.review)}
            </h1>
            <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
              <TxFeeCalculator
                args={[item.loanId, weiAmount]}
                methodName="depositCollateral"
                contractName="sovrynProtocol"
                condition={true}
                textClassName={'tw-text-gray-10 tw-text-gray-10'}
              />
            </div>
            <p className="tw-text-center tw-text-sm tw-mt-3 tw-mb-2">
              {t(translations.addCollateral.newInfo)}
            </p>
            <div className="tw-py-4 tw-px-4 tw-bg-gray-5 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
              <LabelValuePair
                label={t(translations.addCollateral.collateralBalance)}
                valueClassName="tw-text-right"
                value={
                  <>
                    {weiToAssetNumberFormat(
                      newCollateralAmount,
                      tokenDetails.asset,
                    )}{' '}
                    <AssetRenderer asset={tokenDetails.asset} />
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.addCollateral.liquidationPrice)}
                valueClassName="tw-text-right"
                value={
                  <>
                    {toAssetNumberFormat(newLiquidationPrice, loanToken.asset)}{' '}
                    <AssetRenderer asset={loanToken.asset} />
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.addCollateral.collateralRatio)}
                valueClassName="tw-text-right"
                value={
                  <LoadableValue
                    loading={loadingRate}
                    value={<>{newCollateralRatio} %</>}
                  />
                }
              />
            </div>
            <DialogButton
              confirmLabel={t(translations.common.confirm)}
              onConfirm={send}
              disabled={topupLocked || tx.loading || !valid || !canInteract}
            />
          </>
        )}
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
      />
    </>
  );
};
