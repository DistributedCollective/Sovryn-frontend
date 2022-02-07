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
import { getTokenContract } from '../../../../../utils/blockchain/contract-helpers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { DummyInput } from 'app/components/Form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Asset } from '../../../../../types';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMining_ApproveAndAddLiquidityV1 } from '../../hooks/useMining_ApproveAndAddLiquidityV1';
import { useLiquidityMining_getExpectedV1TokenAmount } from '../../hooks/useLiquidityMining_getExpectedV1TokenAmount';
import { useLiquidityMining_getExpectedV1PoolTokens } from '../../hooks/useLiquidityMining_getExpectedV1PoolTokens';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IAddLiquidityDialogV1Props {
  pool: AmmLiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
  onSuccess: () => void;
}

export const AddLiquidityDialogV1: React.FC<IAddLiquidityDialogV1Props> = ({
  pool,
  ...props
}) => {
  const { t } = useTranslation();
  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const addliquidityLocked = checkMaintenance(States.ADD_LIQUIDITY);

  const { assetA, assetB } = pool;

  const [amount1, setAmount1] = useState('0');
  const weiAmount1 = useWeiAmount(amount1);

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

  const { value: balance1 } = useAssetBalanceOf(assetA);
  const { value: balance2 } = useAssetBalanceOf(assetB);

  const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV1(
    pool,
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
      pool.converter,
      // Makes sure RBTC asset is first in the list.
      assetB === Asset.RBTC
        ? [getTokenContract(assetB).address, getTokenContract(assetA).address]
        : [getTokenContract(assetA).address, getTokenContract(assetB).address],
      assetB === Asset.RBTC
        ? [weiAmount2, weiAmount1]
        : [weiAmount1, weiAmount2],
      minReturn,
    ];
  }, [pool, weiAmount1, weiAmount2, minReturn, assetA, assetB]);

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
              )} ${weiToNumberFormat(balance1, 8)}`}
              asset={assetA}
              dataActionId="yieldFarm"
            />
          </FormGroup>
          <DummyInput
            value={weiToNumberFormat(weiAmount2, 8)}
            appendElem={<AssetRenderer asset={assetB} />}
            className="tw-mt-6 tw-h-9"
          />
          <div className="tw-text-xs tw-font-thin tw-mt-1">
            {`${t(translations.common.availableBalance)} ${weiToNumberFormat(
              balance2,
              8,
            )}`}
          </div>
          <TxFeeCalculator
            args={txFeeArgs}
            txConfig={{
              value: assetA === Asset.RBTC ? weiAmount1 : weiAmount2,
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
