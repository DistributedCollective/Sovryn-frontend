import React, { useEffect, useMemo, useState } from 'react';
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
  getPoolTokenContractName,
  getTokenContract,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';
import { AmountInput } from 'form/AmountInput';
import { ArrowDown } from '../../../../components/Arrows';
import { DummyInput } from 'form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxFeeCalculator } from '../../../MarginTradePage/components/TxFeeCalculator';
import { DialogButton } from 'form/DialogButton';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../../../../../utils/models/liquidity-pool';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useLiquidityMining_getUserInfo } from '../../hooks/useLiquidityMining_getUserInfo';
import { Asset } from '../../../../../types';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useMining_ApproveAndRemoveLiquidityV1 } from '../../hooks/useMining_ApproveAndRemoveLiquidityV1';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';

interface Props {
  pool: LiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
}

export function RemoveLiquidityDialogV1({ pool, ...props }: Props) {
  const { t } = useTranslation();

  const canInteract = useCanInteract();

  const mainToken = useMemo(
    () =>
      pool.supplyAssets.find(
        item => item.asset === pool.poolAsset,
      ) as LiquidityPoolSupplyAsset,
    [pool],
  );
  const sideToken = useMemo(
    () =>
      pool.supplyAssets.find(
        item => item.asset !== pool.poolAsset,
      ) as LiquidityPoolSupplyAsset,
    [pool],
  );

  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('0');
  const [sideBalance, setSideBalance] = useState('0');
  const weiAmount = useWeiAmount(amount);

  usePoolToken(pool.poolAsset, pool.poolAsset);

  const {
    value: { amount: poolTokenBalance, accumulatedReward },
    loading,
  } = useLiquidityMining_getUserInfo(mainToken.getContractAddress());

  const { value: supply } = useCacheCallWithValue(
    getPoolTokenContractName(pool.poolAsset, pool.poolAsset),
    'totalSupply',
    '0',
  );

  useEffect(() => {
    const get = async () => {
      const converterBalance = (await contractReader.call(
        getTokenContractName(mainToken.asset),
        'balanceOf',
        [getAmmContract(pool.poolAsset).address],
      )) as any;

      return bignumber(poolTokenBalance)
        .div(supply)
        .mul(converterBalance)
        .toFixed(0);
    };

    get()
      .then(e => setBalance(e))
      .catch(console.error);
  }, [supply, poolTokenBalance, pool.poolAsset, mainToken]);

  useEffect(() => {
    const get = async () => {
      const converterBalance = (await contractReader.call(
        getTokenContractName(sideToken.asset),
        'balanceOf',
        [getAmmContract(pool.poolAsset).address],
      )) as any;

      return bignumber(poolTokenBalance)
        .div(supply)
        .mul(converterBalance)
        .toFixed(0);
    };

    get()
      .then(e => setSideBalance(e))
      .catch(console.error);
  }, [
    supply,
    poolTokenBalance,
    pool.poolAsset,
    pool.supplyAssets,
    sideToken.asset,
  ]);

  const poolWeiAmount = useMemo(
    () =>
      bignumber(weiAmount || '0')
        .div(bignumber(balance || '0').div(poolTokenBalance || '0'))
        .toFixed(0),
    [weiAmount, balance, poolTokenBalance],
  );

  const sideWeiAmount = useMemo(
    () =>
      bignumber(sideBalance || '0')
        .mul(bignumber(weiAmount || '0').div(balance || '0'))
        .toFixed(0) || '0',
    [balance, sideBalance, weiAmount],
  );

  // We are hard-coding 5% slippage here
  const { minReturn: minReturn1 } = useSlippage(weiAmount, 5);
  const { minReturn: minReturn2 } = useSlippage(sideWeiAmount, 5);

  const { withdraw, ...tx } = useMining_ApproveAndRemoveLiquidityV1(
    pool.poolAsset,
    poolWeiAmount,
    [mainToken.asset, sideToken.asset],
    [minReturn1, minReturn2],
  );

  const valid = useMemo(() => {
    return (
      bignumber(poolWeiAmount).lessThanOrEqualTo(poolTokenBalance) &&
      bignumber(poolWeiAmount).greaterThan(0)
    );
  }, [poolWeiAmount, poolTokenBalance]);

  const txFeeArgs = useMemo(() => {
    return [
      getAmmContract(pool.poolAsset).address,
      poolWeiAmount,
      [
        getTokenContract(mainToken.asset).address,
        getTokenContract(sideToken.asset).address,
      ],
      [minReturn1, minReturn2],
    ];
  }, [
    mainToken.asset,
    minReturn1,
    minReturn2,
    pool.poolAsset,
    poolWeiAmount,
    sideToken.asset,
  ]);

  const rewards = useLiquidityMining_getUserAccumulatedReward(
    pool.supplyAssets[0].getContractAddress(),
  );

  const reward = useMemo(
    () => bignumber(rewards.value).add(accumulatedReward).toFixed(0),
    [rewards.value, accumulatedReward],
  );

  const handleConfirm = () => withdraw();

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.withdraw.title)}
          </h1>
          <FormGroup
            label={t(translations.liquidityMining.modals.withdraw.amount)}
            className="tw-mt-5"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              asset={mainToken.asset}
              subText={`${t(
                translations.common.availableBalance,
              )} ${weiToNumberFormat(balance, 8)}`}
              maxAmount={balance}
            />
          </FormGroup>
          <DummyInput
            value={weiToNumberFormat(sideWeiAmount, 8)}
            appendElem={<AssetRenderer asset={sideToken.asset} />}
            className="tw-mt-6 tw-h-9"
          />
          <div className="tw-text-xs tw-font-thin tw-mt-1">
            {`${t(translations.common.availableBalance)} ${weiToNumberFormat(
              sideBalance,
              8,
            )}`}
          </div>
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
            methodName="removeLiquidityFromV1"
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
