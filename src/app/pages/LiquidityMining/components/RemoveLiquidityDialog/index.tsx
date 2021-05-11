import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormGroup } from 'form/FormGroup';

import { Dialog } from '../../../../containers/Dialog';
import { translations } from '../../../../../locales/i18n';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useSlippage } from '../../../BuySovPage/components/BuyForm/useSlippage';
import { bignumber } from 'mathjs';
import {
  getAmmContract,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { AmountInput } from 'form/AmountInput';
import { ArrowDown } from '../../../../components/Arrows';
import { DummyInput } from 'form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxFeeCalculator } from '../../../MarginTradePage/components/TxFeeCalculator';
import { DialogButton } from 'form/DialogButton';
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
    value: { amount: poolTokenBalance },
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
  const { minReturn } = useSlippage(poolWeiAmount, 5);

  const {
    value: expectedReturnAndFee,
    loading: expectedReturnLoading,
  } = useRemoveLiquidityReturnAndFee(
    pool.poolAsset,
    supplyAsset.getContractAddress(),
    poolWeiAmount,
  );

  const { expectedReturn, fee } = useMemo(() => {
    return {
      expectedReturn: bignumber(expectedReturnAndFee[0])
        .minus(expectedReturnAndFee[1])
        .toFixed(0),
      fee: expectedReturnAndFee[1],
    };
  }, [expectedReturnAndFee]);

  const { withdraw, ...tx } = useMining_ApproveAndRemoveLiquidityV2(
    pool.poolAsset,
    asset,
    supplyAsset.getContractAddress(),
    poolWeiAmount,
    minReturn,
  );

  const valid = useMemo(() => {
    return true;
  }, []);

  const txFeeArgs = useMemo(() => {
    return [
      getAmmContract(pool.poolAsset).address,
      getTokenContract(asset).address,
      poolWeiAmount,
      minReturn,
    ];
  }, [pool.poolAsset, asset, poolWeiAmount, minReturn]);

  const handleConfirm = () => withdraw();

  const assets = useMemo(() => pool.supplyAssets.map(item => item.asset), [
    pool.supplyAssets,
  ]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-white tw-text-center">
            Remove Liquidity
          </h1>
          <CollateralAssets
            value={asset}
            onChange={value => setAsset(value)}
            options={assets}
          />
          <FormGroup label="Amount:" className="tw-mt-5">
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              asset={asset}
              maxAmount={balance}
            />
          </FormGroup>
          <ArrowDown />
          <FormGroup label="Expected Return:">
            <DummyInput
              value={
                <LoadableValue
                  loading={expectedReturnLoading}
                  value={weiToNumberFormat(expectedReturn, 6)}
                />
              }
              appendElem={<AssetRenderer asset={asset} />}
            />
          </FormGroup>
          <FormGroup label="Fee:" className="tw-mb-5">
            <DummyInput
              value={
                <LoadableValue
                  loading={expectedReturnLoading}
                  value={weiToNumberFormat(fee, 6)}
                />
              }
              appendElem={<AssetRenderer asset={asset} />}
            />
          </FormGroup>
          <TxFeeCalculator
            args={txFeeArgs}
            methodName="addLiquidityToV2"
            contractName="BTCWrapperProxy"
          />
          {/*{topupLocked?.maintenance_active && (*/}
          {/*  <ErrorBadge content={topupLocked?.message} />*/}
          {/*)}*/}
        </div>

        <div className="tw-px-5">
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirm()}
            disabled={tx.loading || !valid || !canInteract}
            cancelLabel={t(translations.common.cancel)}
            onCancel={props.onCloseModal}
          />
        </div>
      </Dialog>
      <TxDialog tx={tx} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}
