import React, { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'app/components/Form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import {
  getAmmContract,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { DummyInput } from 'app/components/Form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Asset } from '../../../../../types';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';
import {
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { useMining_ApproveAndAddLiquidityV1 } from '../../hooks/useMining_ApproveAndAddLiquidityV1';
import { useLiquidityMining_getExpectedV1TokenAmount } from '../../hooks/useLiquidityMining_getExpectedV1TokenAmount';
import { useLiquidityMining_getExpectedV1PoolTokens } from '../../hooks/useLiquidityMining_getExpectedV1PoolTokens';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';

interface Props {
  pool: LiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
  onSuccess: () => void;
}

export function AddLiquidityDialogV1({ pool, ...props }: Props) {
  const { t } = useTranslation();
  usePoolToken(pool.poolAsset, pool.poolAsset);
  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const addliquidityLocked = checkMaintenance(States.ADD_LIQUIDITY);

  const token1 = pool.supplyAssets[0].asset;
  const token2 = pool.supplyAssets[1].asset;

  const [amount1, setAmount1] = useState('0');
  const weiAmount1 = useWeiAmount(amount1, token1);

  const { value: weiAmount2 } = useLiquidityMining_getExpectedV1TokenAmount(
    pool,
    weiAmount1,
  );

  const { value: poolWeiAmount } = useLiquidityMining_getExpectedV1PoolTokens(
    pool,
    weiAmount1,
  );

  // We are hard-coding 1% slippage here
  const { minReturn } = useSlippage(poolWeiAmount, 1);

  const { value: balance1 } = useAssetBalanceOf(token1);
  const { value: balance2 } = useAssetBalanceOf(token2);

  const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV1(
    pool.poolAsset,
    [token1, token2],
    [weiAmount1, weiAmount2],
    minReturn,
  );
  const hasSufficientBalance = useMemo(() => {
    return (
      bignumber(balance1).greaterThanOrEqualTo(weiAmount1) &&
      bignumber(balance2).greaterThanOrEqualTo(weiAmount2)
    );
  }, [balance1, balance2, weiAmount1, weiAmount2]);

  const valid = useMemo(() => {
    return (
      hasSufficientBalance &&
      bignumber(weiAmount1).greaterThan(0) &&
      bignumber(weiAmount2).greaterThan(0)
    );
  }, [hasSufficientBalance, weiAmount1, weiAmount2]);

  const txFeeArgs = useMemo(() => {
    return [
      getAmmContract(pool.poolAsset).address,
      // Makes sure RBTC asset is first in the list.
      token2 === Asset.RBTC
        ? [getTokenContract(token2).address, getTokenContract(token1).address]
        : [getTokenContract(token1).address, getTokenContract(token2).address],
      token2 === Asset.RBTC
        ? [weiAmount2, weiAmount1]
        : [weiAmount1, weiAmount2],
      minReturn,
    ];
  }, [pool, weiAmount1, weiAmount2, minReturn, token1, token2]);

  const handleConfirm = () => deposit();

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.deposit.title)}
          </h1>

          <FormGroup
            label={t(translations.liquidityMining.modals.deposit.amount)}
            className="tw-mt-5 tw-font-thin"
          >
            <AmountInput
              onChange={value => setAmount1(value)}
              value={amount1}
              subText={`${t(
                translations.common.availableBalance,
              )} ${weiToAssetNumberFormat(balance1, token1, 8)}`}
              asset={token1}
            />
          </FormGroup>
          <DummyInput
            value={weiToNumberFormat(weiAmount2, 8)}
            appendElem={<AssetRenderer asset={token2} />}
            className="tw-mt-6 tw-h-9"
          />
          <div className="tw-text-xs tw-font-thin tw-mt-1">
            {`${t(
              translations.common.availableBalance,
            )} ${weiToAssetNumberFormat(balance2, token2, 8)}`}
          </div>
          <TxFeeCalculator
            args={txFeeArgs}
            txConfig={{
              value: token1 === Asset.RBTC ? weiAmount1 : weiAmount2,
            }}
            methodName="addLiquidityToV1"
            contractName="BTCWrapperProxy"
            className="tw-mt-6"
          />

          {addliquidityLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.addLiquidity}
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
          {!addliquidityLocked && (
            <DialogButton
              confirmLabel={t(translations.liquidityMining.modals.deposit.cta)}
              onConfirm={() => handleConfirm()}
              disabled={
                tx.loading || !valid || !canInteract || addliquidityLocked
              }
              className="tw-rounded-lg"
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
}
