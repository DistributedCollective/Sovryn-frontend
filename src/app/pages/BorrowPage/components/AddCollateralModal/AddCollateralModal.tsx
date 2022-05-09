import React, { useCallback, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { calculateCollateralRatio, calculateLiquidationPrice } from './utils';
import { CollateralForm } from './CollateralForm';
import { ReviewStep } from './ReviewStep';
import { fromWei } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';

type AddCollateralModalProps = {
  loan: ActiveLoan;
  onCloseModal: () => void;
  onSubmit: (
    collateralToken: Asset,
    loanId: string,
    depositAmount: string,
  ) => void;
  liquidationPrice?: React.ReactNode;
  positionSize?: string;
  tx: ResetTxResponseInterface;
};

enum Step {
  FORM,
  REVIEW,
}

export const AddCollateralModal: React.FC<AddCollateralModalProps> = ({
  loan: item,
  tx,
  onSubmit,
}) => {
  const canInteract = useCanInteract();
  const tokenDetails = useMemo(
    () =>
      AssetsDictionary.getByTokenContractAddress(item?.collateralToken || ''),
    [item?.collateralToken],
  );
  const loanToken = useMemo(
    () => AssetsDictionary.getByTokenContractAddress(item?.loanToken || ''),
    [item?.loanToken],
  );
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(Step.FORM);
  const { value: balance } = useAssetBalanceOf(tokenDetails.asset);
  const weiAmount = useWeiAmount(amount);

  const { checkMaintenance, States } = useMaintenance();
  const topupLocked = checkMaintenance(States.ADD_TO_MARGIN_TRADES);

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);

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

  const maintenanceRatio = useMemo(
    () => bignumber(fromWei(item.maintenanceMargin)).add(100).toFixed(0),
    [item.maintenanceMargin],
  );

  const currentLiquidationPrice = useMemo(
    () =>
      calculateLiquidationPrice(
        item.principal,
        item.collateral,
        maintenanceRatio,
      ),
    [item.collateral, item.principal, maintenanceRatio],
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
        maintenanceRatio,
      ),
    [item.collateral, item.principal, maintenanceRatio, weiAmount],
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

  const formDisabled = useMemo(
    () => topupLocked || tx.loading || !valid || !canInteract,
    [canInteract, topupLocked, tx.loading, valid],
  );

  const handleSubmit = useCallback(
    () => onSubmit(tokenDetails.asset, item.loanId, weiAmount),
    [item.loanId, onSubmit, tokenDetails.asset, weiAmount],
  );

  return (
    <>
      <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
        {step === Step.FORM && (
          <CollateralForm
            item={item}
            tokenDetails={tokenDetails}
            loanToken={loanToken}
            currentCollateralRatio={currentCollateralRatio}
            currentLiquidationPrice={currentLiquidationPrice}
            loading={loadingRate}
            newCollateralAmount={newCollateralAmount}
            newCollateralRatio={newCollateralRatio}
            newLiquidationPrice={newLiquidationPrice}
            amount={amount}
            topupLocked={topupLocked}
            valid={valid}
            formDisabled={formDisabled}
            onAmountChange={setAmount}
            onSubmit={handleNextStep}
          />
        )}

        {step === Step.REVIEW && (
          <ReviewStep
            item={item}
            tokenDetails={tokenDetails}
            loanToken={loanToken}
            amount={amount}
            newCollateralAmount={newCollateralAmount}
            newCollateralRatio={newCollateralRatio}
            newLiquidationPrice={newLiquidationPrice}
            loading={loadingRate}
            formDisabled={formDisabled}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
};
