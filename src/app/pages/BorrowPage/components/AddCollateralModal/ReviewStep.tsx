import React from 'react';
import { translations } from 'locales/i18n';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { DialogButton } from 'app/components/Form/DialogButton';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { LoadableValue } from 'app/components/LoadableValue';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import {
  weiToAssetNumberFormat,
  toAssetNumberFormat,
} from 'utils/display-text/format';
import { useTranslation } from 'react-i18next';
import { AssetDetails } from 'utils/models/asset-details';

type ReviewStepProps = {
  item: ActiveLoan;
  amount: string;
  newCollateralAmount: string;
  newCollateralRatio: string;
  newLiquidationPrice: string;
  tokenDetails: AssetDetails;
  loanToken: AssetDetails;
  loadingRate: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
};

export const ReviewStep: React.FC<ReviewStepProps> = ({
  item,
  amount,
  newCollateralAmount,
  newCollateralRatio,
  newLiquidationPrice,
  tokenDetails,
  loanToken,
  loadingRate,
  canSubmit,
  onSubmit,
}) => {
  const weiAmount = useWeiAmount(amount);
  const { t } = useTranslation();
  return (
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
              {weiToAssetNumberFormat(newCollateralAmount, tokenDetails.asset)}{' '}
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
        onConfirm={onSubmit}
        disabled={canSubmit}
      />
    </>
  );
};
