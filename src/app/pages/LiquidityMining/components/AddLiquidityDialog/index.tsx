import React, { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'app/components/Form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { getTokenContract } from '../../../../../utils/blockchain/contract-helpers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useMining_ApproveAndAddLiquidityV2 } from '../../hooks/useMining_ApproveAndAddLiquidityV2';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IAddLiquidityDialogProps {
  pool: AmmLiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
  onSuccess: () => void;
}

export const AddLiquidityDialog: React.FC<IAddLiquidityDialogProps> = ({
  pool,
  ...props
}: IAddLiquidityDialogProps) => {
  const { t } = useTranslation();
  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const addliquidityLocked = checkMaintenance(States.ADD_LIQUIDITY);

  const [asset, setAsset] = useState(pool.assetA);
  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const minReturn = '1';

  const { value: balance } = useAssetBalanceOf(asset);

  const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV2(
    pool,
    asset,
    weiAmount,
    minReturn,
  );

  const valid = useMemo(() => {
    return (
      bignumber(balance).greaterThanOrEqualTo(weiAmount) &&
      bignumber(weiAmount).greaterThan(0)
    );
  }, [balance, weiAmount]);

  const txFeeArgs = useMemo(() => {
    return [
      pool.converter,
      getTokenContract(asset).address,
      weiAmount,
      minReturn,
    ];
  }, [pool, asset, weiAmount, minReturn]);

  const handleConfirm = () => deposit();

  const assets = useMemo(() => [pool.assetA, pool.assetB], [pool]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.deposit.title)}
          </h1>

          <CollateralAssets
            value={asset}
            onChange={value => setAsset(value)}
            options={assets}
          />
          <FormGroup
            label={t(translations.liquidityMining.modals.deposit.amount)}
            className="tw-mt-8"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              subText={`${t(
                translations.common.availableBalance,
              )} ${weiToNumberFormat(balance, 8)}`}
              asset={asset}
              dataActionId="yieldFarm"
            />
          </FormGroup>
          <TxFeeCalculator
            args={txFeeArgs}
            methodName="addLiquidityToV2"
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
