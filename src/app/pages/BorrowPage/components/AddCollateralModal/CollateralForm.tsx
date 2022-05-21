import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FormGroup } from '@blueprintjs/core';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { LoadableValue } from 'app/components/LoadableValue';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { translations } from 'locales/i18n';
import { discordInvite, gasLimit } from 'utils/classifiers';
import {
  toAssetNumberFormat,
  weiToAssetNumberFormat,
} from 'utils/display-text/format';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { AssetDetails } from 'utils/models/asset-details';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { TxType } from 'store/global/transactions-store/types';

type CollateralFormType = {
  item: ActiveLoan;
  tokenDetails: AssetDetails;
  loanToken: AssetDetails;
  currentLiquidationPrice: string;
  currentCollateralRatio: string;
  loading: boolean;
  newCollateralAmount: string;
  newCollateralRatio: string;
  newLiquidationPrice: string;
  amount: string;
  formDisabled: boolean;
  topupLocked: boolean;
  valid: boolean;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
};

export const CollateralForm: React.FC<CollateralFormType> = ({
  item,
  tokenDetails,
  loanToken,
  currentLiquidationPrice,
  loading,
  currentCollateralRatio,
  newCollateralAmount,
  newCollateralRatio,
  newLiquidationPrice,
  amount,
  topupLocked,
  valid,
  formDisabled,
  onAmountChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [gasFee, setGasFee] = useState('0');
  const weiAmount = useWeiAmount(amount);
  return (
    <>
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
              {toAssetNumberFormat(currentLiquidationPrice, loanToken.asset)}{' '}
              <AssetRenderer asset={loanToken.asset} />
            </>
          }
        />
        <LabelValuePair
          label={t(translations.addCollateral.collateralRatio)}
          value={
            <LoadableValue
              loading={loading}
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
          onChange={onAmountChange}
          value={amount}
          asset={tokenDetails.asset}
          showBalance={true}
          gasFee={gasFee}
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
                {toAssetNumberFormat(newLiquidationPrice, loanToken.asset)}{' '}
                <AssetRenderer asset={loanToken.asset} />
              </>
            }
          />
          <LabelValuePair
            label={t(translations.addCollateral.collateralRatio)}
            value={
              <LoadableValue
                loading={loading}
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
          onFeeUpdated={setGasFee}
          txConfig={{ gas: gasLimit[TxType.DEPOSIT_COLLATERAL] }}
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
        onConfirm={onSubmit}
        disabled={formDisabled}
      />
    </>
  );
};
