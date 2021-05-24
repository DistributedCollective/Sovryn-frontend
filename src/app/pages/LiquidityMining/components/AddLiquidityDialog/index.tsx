import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AmountInput } from 'form/AmountInput';
import { DialogButton } from 'form/DialogButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import {
  getAmmContract,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useMining_ApproveAndAddLiquidityV2 } from '../../hooks/useMining_ApproveAndAddLiquidityV2';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';

interface Props {
  pool: LiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
}

export function AddLiquidityDialog({ pool, ...props }: Props) {
  const { t } = useTranslation();

  const canInteract = useCanInteract();

  const [asset, setAsset] = useState(pool.poolAsset);
  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);
  // We are hard-coding 5% slippage here
  // const { minReturn } = useSlippage(weiAmount, 5);
  const minReturn = '1';

  const { value: balance } = useAssetBalanceOf(asset);

  const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV2(
    pool.poolAsset,
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
      getAmmContract(pool.poolAsset).address,
      getTokenContract(asset).address,
      weiAmount,
      minReturn,
    ];
  }, [pool, asset, weiAmount, minReturn]);

  const handleConfirm = () => deposit();

  const assets = useMemo(() => pool.supplyAssets.map(item => item.asset), [
    pool.supplyAssets,
  ]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.deposit.title)}
          </h1>

          <CollateralAssets
            value={asset}
            onChange={value => setAsset(value)}
            options={assets}
            label={t(translations.liquidityMining.modals.deposit.asset)}
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
            />
          </FormGroup>

          {/*<ArrowDown />*/}

          {/*<FormGroup label="Estimated Fees Earned (Year):">*/}
          {/*  <Input*/}
          {/*    value="0"*/}
          {/*    readOnly*/}
          {/*    appendElem={<AssetRenderer asset={asset} />}*/}
          {/*  />*/}
          {/*</FormGroup>*/}

          {/*<FormGroup label="Expected Reward:" className="tw-mb-5">*/}
          {/*  <Input*/}
          {/*    value="0"*/}
          {/*    readOnly*/}
          {/*    appendElem={<AssetRenderer asset={Asset.SOV} />}*/}
          {/*  />*/}
          {/*</FormGroup>*/}

          <TxFeeCalculator
            args={txFeeArgs}
            methodName="addLiquidityToV2"
            contractName="BTCWrapperProxy"
            className="tw-mt-6"
          />

          {/*{topupLocked?.maintenance_active && (*/}
          {/*  <ErrorBadge content={topupLocked?.message} />*/}
          {/*)}*/}

          <DialogButton
            confirmLabel={t(translations.liquidityMining.modals.deposit.cta)}
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
