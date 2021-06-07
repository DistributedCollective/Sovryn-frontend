import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'app/components/Form/FormGroup';
import { Dialog } from '../../../../containers/Dialog';
import { translations } from '../../../../../locales/i18n';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useSlippage } from '../../../BuySovPage/components/BuyForm/useSlippage';
import {
  getAmmContract,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ArrowDown } from '../../../../components/Arrows';
import { DummyInput } from 'app/components/Form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxFeeCalculator } from '../../../MarginTradePage/components/TxFeeCalculator';
import { DialogButton } from 'app/components/Form/DialogButton';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useMining_ApproveAndRemoveLiquidityV2 } from '../../hooks/useMining_ApproveAndRemoveLiquidityV2';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';
import { useRemoveLiquidityReturnAndFee } from '../../../../hooks/amm/useRemoveLiquidityReturnAndFee';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../../../../../utils/models/liquidity-pool';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useLiquidityMining_getUserInfo } from '../../hooks/useLiquidityMining_getUserInfo';
import { Asset } from '../../../../../types';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';

interface Props {
  pool: LiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
}

export function RemoveLiquidityDialog({ pool, ...props }: Props) {
  const { t } = useTranslation();

  const canInteract = useCanInteract();

  const [asset, setAsset] = useState(pool.poolAsset);
  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  usePoolToken(pool.poolAsset, asset);

  const supplyAsset = useMemo(() => {
    return pool.supplyAssets.find(
      item => item.asset === asset,
    ) as LiquidityPoolSupplyAsset;
  }, [pool.supplyAssets, asset]);

  const {
    value: { amount: poolTokenBalance, accumulatedReward },
    loading,
  } = useLiquidityMining_getUserInfo(supplyAsset.getContractAddress());
  const {
    value: { 0: balance },
  } = useRemoveLiquidityReturnAndFee(
    pool.poolAsset,
    supplyAsset.getContractAddress(),
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
    pool.poolAsset,
    asset,
    supplyAsset.getContractAddress(),
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
      getAmmContract(pool.poolAsset).address,
      getTokenContract(asset).address,
      poolWeiAmount || '0',
      minReturn || '0',
    ];
  }, [pool.poolAsset, asset, poolWeiAmount, minReturn]);

  const rewards = useLiquidityMining_getUserAccumulatedReward(
    supplyAsset.getContractAddress(),
  );

  const reward = useMemo(
    () => bignumber(rewards.value).add(accumulatedReward).toFixed(0),
    [rewards.value, accumulatedReward],
  );

  const handleConfirm = () => withdraw();

  const assets = useMemo(() => pool.supplyAssets.map(item => item.asset), [
    pool.supplyAssets,
  ]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
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
          {/*{topupLocked?.maintenance_active && (*/}
          {/*  <ErrorBadge content={topupLocked?.message} />*/}
          {/*)}*/}

          <DialogButton
            confirmLabel={t(translations.liquidityMining.modals.withdraw.cta)}
            onConfirm={() => handleConfirm()}
            disabled={tx.loading || !valid || !canInteract}
            className="tw-rounded-lg"
          />
        </div>
      </Dialog>
      <TxDialog tx={tx} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}
