import React, { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'app/components/Form/FormGroup';
import { Dialog } from '../../../../containers/Dialog';
import { translations } from '../../../../../locales/i18n';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useSlippage } from '../../../BuySovPage/components/BuyForm/useSlippage';
import { getTokenContract } from '../../../../../utils/blockchain/contract-helpers';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ArrowDown } from '../../../../components/Arrows';
import { DummyInput } from 'app/components/Form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxFeeCalculator } from '../../../MarginTradePage/components/TxFeeCalculator';
import { DialogButton } from 'app/components/Form/DialogButton';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useMining_ApproveAndRemoveLiquidityV2 } from '../../hooks/useMining_ApproveAndRemoveLiquidityV2';
import { useMining_RemoveLiquidityReturnAndFee } from '../../hooks/useMining_RemoveLiquidityReturnAndFee';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useLiquidityMining_getUserInfo } from '../../hooks/useLiquidityMining_getUserInfo';
import { Asset } from '../../../../../types';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IRemoveLiquidityDialogProps {
  pool: AmmLiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
  onSuccess: () => void;
}

export const RemoveLiquidityDialog: React.FC<IRemoveLiquidityDialogProps> = ({
  pool,
  ...props
}) => {
  const { t } = useTranslation();

  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const removeLiquidityLocked = checkMaintenance(States.REMOVE_LIQUIDITY);

  const [asset, setAsset] = useState(pool.assetA);
  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const poolTokenAddress = pool.getPoolTokenAddress(asset)!;

  const {
    value: { amount: poolTokenBalance, accumulatedReward },
    loading,
  } = useLiquidityMining_getUserInfo(poolTokenAddress);
  const {
    value: { 0: balance },
  } = useMining_RemoveLiquidityReturnAndFee(
    pool,
    poolTokenAddress,
    poolTokenBalance,
  );

  const poolWeiAmount = useMemo(
    () =>
      bignumber(weiAmount)
        .div(bignumber(balance).div(poolTokenBalance))
        .toFixed(0),
    [weiAmount, balance, poolTokenBalance],
  );

  // We are hard-coding 5% slippage here
  const { minReturn } = useSlippage(weiAmount, 5);

  const { withdraw, ...tx } = useMining_ApproveAndRemoveLiquidityV2(
    pool,
    asset,
    poolWeiAmount,
    minReturn,
  );

  const valid = useMemo(() => {
    return (
      bignumber(poolWeiAmount).lessThanOrEqualTo(poolTokenBalance) &&
      bignumber(poolWeiAmount).greaterThan(0)
    );
  }, [poolTokenBalance, poolWeiAmount]);

  const txFeeArgs = useMemo(() => {
    return [
      pool.converter,
      getTokenContract(asset).address,
      poolWeiAmount || '0',
      minReturn || '0',
    ];
  }, [pool, asset, poolWeiAmount, minReturn]);

  const rewards = useLiquidityMining_getUserAccumulatedReward(poolTokenAddress);

  const reward = useMemo(
    () => bignumber(rewards.value).add(accumulatedReward).toFixed(0),
    [rewards.value, accumulatedReward],
  );

  const handleConfirm = () => withdraw();

  const assets = useMemo(() => [pool.assetA, pool.assetB], [pool]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.withdraw.title)}
          </h1>
          <CollateralAssets
            value={asset}
            onChange={value => setAsset(value)}
            options={assets}
          />
          <FormGroup
            label={t(translations.liquidityMining.modals.withdraw.amount)}
            className="tw-mt-8"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              subText={`${t(
                translations.common.availableBalance,
              )} ${weiToNumberFormat(balance, 8)}`}
              asset={asset}
              maxAmount={balance}
              dataActionId="yieldFarm"
            />
          </FormGroup>
          <ArrowDown />
          <FormGroup
            label={t(translations.liquidityMining.modals.withdraw.reward)}
          >
            <DummyInput
              value={
                <LoadableValue
                  loading={rewards.loading || loading}
                  value={weiToNumberFormat(reward, 6)}
                />
              }
              appendElem={<AssetRenderer asset={Asset.SOV} />}
            />
          </FormGroup>
          <TxFeeCalculator
            args={txFeeArgs}
            methodName="removeLiquidityFromV2"
            contractName="BTCWrapperProxy"
            className="tw-mt-6"
          />

          {removeLiquidityLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.removeLiquidity}
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
          {!removeLiquidityLocked && (
            <DialogButton
              confirmLabel={t(translations.liquidityMining.modals.withdraw.cta)}
              onConfirm={() => handleConfirm()}
              disabled={
                tx.loading || !valid || !canInteract || removeLiquidityLocked
              }
              className="tw-rounded-lg"
              data-action-id="yieldFarm-liquidityModal-confirm"
            />
          )}
        </div>
      </Dialog>
      <TxDialog
        tx={tx}
        onUserConfirmed={() => props.onCloseModal()}
        onSuccess={props.onSuccess}
      />
    </>
  );
};
