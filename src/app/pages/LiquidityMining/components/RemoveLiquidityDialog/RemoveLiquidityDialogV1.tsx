import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { FormGroup } from 'app/components/Form/FormGroup';

import { Dialog } from '../../../../containers/Dialog';
import { translations } from '../../../../../locales/i18n';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useSlippage } from '../../../BuySovPage/components/BuyForm/useSlippage';
import { bignumber } from 'mathjs';
import {
  getContract,
  getTokenContract,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ArrowDown } from '../../../../components/Arrows';
import { DummyInput } from 'app/components/Form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxFeeCalculator } from '../../../MarginTradePage/components/TxFeeCalculator';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useLiquidityMining_getUserInfo } from '../../hooks/useLiquidityMining_getUserInfo';
import { Asset } from '../../../../../types';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useMining_ApproveAndRemoveLiquidityV1 } from '../../hooks/useMining_ApproveAndRemoveLiquidityV1';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

import { useCacheCallToWithValue } from 'app/hooks/chain/useCacheCallToWithValue';
import { Button } from 'app/components/Button';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IRemoveLiquidityDialogV1Props {
  pool: AmmLiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
  onSuccess: () => void;
}

export const RemoveLiquidityDialogV1: React.FC<IRemoveLiquidityDialogV1Props> = ({
  pool,
  ...props
}) => {
  const { t } = useTranslation();

  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const removeliquidityLocked = checkMaintenance(States.REMOVE_LIQUIDITY);

  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('0');
  const [sideBalance, setSideBalance] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const {
    value: { amount: poolTokenBalance, accumulatedReward },
    loading,
  } = useLiquidityMining_getUserInfo(pool.poolTokenA);

  const { value: supply } = useCacheCallToWithValue(
    pool.poolTokenA,
    getContract('SOV_token').abi,
    'totalSupply',
    '0',
    [],
  );

  useEffect(() => {
    const get = async () => {
      const converterBalance = await contractReader.call<string>(
        getTokenContractName(pool.assetA),
        'balanceOf',
        [pool.converter],
      );

      return bignumber(poolTokenBalance)
        .div(supply)
        .mul(converterBalance)
        .toFixed(0);
    };

    get()
      .then(e => setBalance(e))
      .catch(console.error);
  }, [supply, poolTokenBalance, pool]);

  useEffect(() => {
    const get = async () => {
      const converterBalance = await contractReader.call<string>(
        getTokenContractName(pool.assetB),
        'balanceOf',
        [pool.converter],
      );

      return bignumber(poolTokenBalance)
        .div(supply)
        .mul(converterBalance)
        .toFixed(0);
    };

    get()
      .then(e => setSideBalance(e))
      .catch(console.error);
  }, [supply, poolTokenBalance, pool]);

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
    pool,
    poolWeiAmount,
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
      pool.converter,
      poolWeiAmount,
      [
        getTokenContract(pool.assetA).address,
        getTokenContract(pool.assetB).address,
      ],
      [minReturn1, minReturn2],
    ];
  }, [minReturn1, minReturn2, pool, poolWeiAmount]);

  const rewards = useLiquidityMining_getUserAccumulatedReward(pool.poolTokenA);

  const reward = useMemo(
    () => bignumber(rewards.value).add(accumulatedReward).toFixed(0),
    [rewards.value, accumulatedReward],
  );

  const handleConfirm = () => withdraw();

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.withdraw.title)}
          </h1>
          <FormGroup
            label={t(translations.liquidityMining.modals.withdraw.amount)}
            className="tw-mt-5"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              asset={pool.assetA}
              subText={`${t(
                translations.common.availableBalance,
              )} ${weiToNumberFormat(balance, 8)}`}
              maxAmount={balance}
              dataActionId="yieldFarm-withdraw"
            />
          </FormGroup>
          <DummyInput
            value={weiToNumberFormat(sideWeiAmount, 8)}
            appendElem={<AssetRenderer asset={pool.assetB} />}
            className="tw-mt-6 tw-h-9"
          />
          <div className="tw-text-xs tw-font-extralight tw-mt-1">
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

          {removeliquidityLocked && (
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
          {!removeliquidityLocked && (
            <Button
              text={t(translations.liquidityMining.modals.withdraw.cta)}
              onClick={handleConfirm}
              disabled={
                tx.loading || !valid || !canInteract || removeliquidityLocked
              }
              dataActionId={`yieldFarm-deposit-confirmButton-${pool.assetA}`}
              className="tw-w-full tw-mt-2"
            />
          )}
        </div>
      </Dialog>
      <TransactionDialog
        tx={tx}
        onUserConfirmed={() => props.onCloseModal()}
        onSuccess={props.onSuccess}
      />
    </>
  );
};
