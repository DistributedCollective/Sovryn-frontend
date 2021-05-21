import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';

import { FormGroup } from 'form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { AmountInput } from 'form/AmountInput';
import { DialogButton } from 'form/DialogButton';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import {
  getAmmContract,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { DummyInput } from 'form/Input';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Asset } from '../../../../../types';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { usePoolToken } from '../../../../hooks/amm/usePoolToken';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { useMining_ApproveAndAddLiquidityV1 } from '../../hooks/useMining_ApproveAndAddLiquidityV1';
import { useTargetAmountAndFee } from '../../../../hooks/amm/useTargetAmountAndFee';

interface Props {
  pool: LiquidityPool;
  showModal: boolean;
  onCloseModal: () => void;
}

export function AddLiquidityDialogV1({ pool, ...props }: Props) {
  const { t } = useTranslation();
  usePoolToken(pool.poolAsset, pool.poolAsset);

  const canInteract = useCanInteract();

  const token1 = pool.supplyAssets[0].asset;
  const token2 = pool.supplyAssets[1].asset;

  const [amount1, setAmount1] = useState('0');
  const weiAmount1 = useWeiAmount(amount1);
  // We are hard-coding 5% slippage here
  // const { minReturn } = useSlippage(weiAmount1, 5);
  const minReturn = '1';

  const { value: targetAmount } = useTargetAmountAndFee(
    pool.poolAsset,
    token1,
    token2,
    weiAmount1,
  );

  const weiAmount2 = useMemo(
    () => bignumber(targetAmount[0]).add(targetAmount[1]).toString(),
    [targetAmount],
  );

  const { value: balance1 } = useAssetBalanceOf(token1);
  const { value: balance2 } = useAssetBalanceOf(token2);

  const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV1(
    pool.poolAsset,
    [token1, token2],
    [weiAmount1, weiAmount2],
    minReturn,
  );

  const valid = useMemo(() => {
    return (
      bignumber(balance1).greaterThanOrEqualTo(weiAmount1) &&
      bignumber(weiAmount1).greaterThan(0) &&
      bignumber(balance2).greaterThanOrEqualTo(weiAmount2) &&
      bignumber(weiAmount2).greaterThan(0)
    );
  }, [balance1, balance2, weiAmount1, weiAmount2]);

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
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
            {t(translations.liquidityMining.modals.deposit.title)}
          </h1>

          <FormGroup label="Amount:" className="tw-mt-5">
            <AmountInput
              onChange={value => setAmount1(value)}
              value={amount1}
              asset={token1}
            />
          </FormGroup>

          <DummyInput
            value={weiToNumberFormat(weiAmount2, 8)}
            appendElem={<AssetRenderer asset={token2} />}
            className="tw-mt-8"
          />

          {/*<ArrowDown />*/}

          {/*<FormGroup label="Expected Reward:" className="tw-mb-5">*/}
          {/*  <Input*/}
          {/*    value="0"*/}
          {/*    readOnly*/}
          {/*    appendElem={<AssetRenderer asset={Asset.SOV} />}*/}
          {/*  />*/}
          {/*</FormGroup>*/}

          <TxFeeCalculator
            args={txFeeArgs}
            txConfig={{
              value: token1 === Asset.RBTC ? weiAmount1 : weiAmount2,
            }}
            methodName="addLiquidityToV1"
            contractName="BTCWrapperProxy"
            className="tw-mt-5 tw-font-extralight"
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
