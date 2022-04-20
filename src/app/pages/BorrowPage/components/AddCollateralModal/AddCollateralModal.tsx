import React, { useCallback, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { useApproveAndAddMargin } from '../../../../hooks/trading/useApproveAndAndMargin';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { ActiveLoan } from 'app/hooks/trading/useGetLoan';
import { useDenominateAssetAmount } from 'app/hooks/trading/useDenominateAssetAmount';
import { calculateCollateralRatio, calculateLiquidationPrice } from './utils';
import { CollateralForm } from './CollateralForm';
import { ReviewStep } from './ReviewStep';
import { fromWei } from 'utils/blockchain/math-helpers';

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

  const { send, ...tx } = useApproveAndAddMargin(
    tokenDetails.asset,
    item.loanId,
    weiAmount,
  );
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

  const canSubmit = useMemo(
    () => topupLocked || tx.loading || !valid || !canInteract,
    [canInteract, topupLocked, tx.loading, valid],
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
            loadingRate={loadingRate}
            newCollateralAmount={newCollateralAmount}
            newCollateralRatio={newCollateralRatio}
            newLiquidationPrice={newLiquidationPrice}
            amount={amount}
            topupLocked={topupLocked}
            valid={valid}
            canSubmit={canSubmit}
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
            loadingRate={loadingRate}
            canSubmit={canSubmit}
            onSubmit={send}
          />
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
