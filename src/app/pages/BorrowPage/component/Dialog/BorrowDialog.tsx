import { AmountInput } from 'form/AmountInput';
import { DialogButton } from 'form/DialogButton';
import { FormGroup } from 'form/FormGroup';
import { bignumber } from 'mathjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';

import { translations } from '../../../../../locales/i18n';
import { Asset } from '../../../../../types';
import { getAmmContract, getTokenContract } from '../../../../../utils/blockchain/contract-helpers';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { LiquidityPool } from '../../../../../utils/models/liquidity-pool';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { Dialog } from '../../../../containers/Dialog';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { CollateralAssets } from '../../../MarginTradePage/components/CollateralAssets';
import { AssetSelector } from '../AssetSelector/Loadable';
import { Input } from '../Input';
import { DummyInput } from 'form/Input';


interface Props {
  showModal: boolean;
  onCloseModal: () => void;
}
interface Option {
  key: Asset;
  label: string;
}
export function BorrowDialog({ ...props }: Props) {
  const { t } = useTranslation();

//   const canInteract = useCanInteract();
  const [sourceToken, setSourceToken] = useState(Asset.RBTC);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);
  // We are hard-coding 5% slippage here
  // const { minReturn } = useSlippage(weiAmount, 5);
  const minReturn = '1';
  const { value: tokens } = useCacheCallWithValue<string[]>(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );

  const getOptions = useCallback(() => {
    return (tokens
      .map(item => {
        const asset = AssetsDictionary.getByTokenContractAddress(item);
        if (!asset) {
          return null;
        }
        return {
          key: asset.asset,
          label: asset.symbol,
        };
      })
      .filter(item => item !== null) as unknown) as Option[];
  }, [tokens]);

  useEffect(() => {
    const newOptions = getOptions();
    setSourceOptions(newOptions);

    if (
      !newOptions.find(item => item.key === sourceToken) &&
      newOptions.length
    ) {
      setSourceToken(newOptions[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);


//   const { deposit, ...tx } = useMining_ApproveAndAddLiquidityV2(
//     pool.poolAsset,
//     asset,
//     weiAmount,
//     minReturn,
//   );

//   const valid = useMemo(() => {
//     return (
//       bignumber(balance).greaterThanOrEqualTo(weiAmount) &&
//       bignumber(weiAmount).greaterThan(0)
//     );
//   }, [balance, weiAmount]);

//   const txFeeArgs = useMemo(() => {
//     return [
//       getAmmContract(pool.poolAsset).address,
//       getTokenContract(asset).address,
//       weiAmount,
//       minReturn,
//     ];
//   }, [pool, asset, weiAmount, minReturn]);

  const handleConfirm = () => {
    console.log('acsd');
  };

//   const assets = useMemo(() => pool.supplyAssets.map(item => item.asset), [
//     pool.supplyAssets,
//   ]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
            {t(translations.borrowPage.modal.borrowModal.title)}
          </h1>

          {/* <CollateralAssets
            value={asset}
            onChange={value => setAsset(value)}
            options={assets}
          /> */}
          <FormGroup
            label={t(translations.borrowPage.modal.borrowModal.amount)}
            className="tw-mt-8"
          >
            <Input
              value={amount}
              type="text"
              onChange={value => setAmount(value)}
              placeholder="0.0000"
              rightElement={<AssetRenderer asset={sourceToken} />}
            />
          </FormGroup>
          <FormGroup
            label={t(translations.borrowPage.modal.borrowModal.collateral)}
            className="tw-mt-8"
          >
            <AssetSelector
              value={sourceToken}
              items={sourceOptions}
              placeholder=""
              onChange={value => setSourceToken(value.key)}
            />
          </FormGroup>
          <FormGroup
            label={t(translations.borrowPage.modal.borrowModal.collateral)}
            className="tw-mt-8"
          >
            <DummyInput
              value={weiToNumberFormat(10, 8)}
              appendElem={<AssetRenderer asset={Asset.RBTC} />}
              className="tw-mt-6 tw-h-9"
            />
          </FormGroup>

          {/* <ArrowDown />*/}

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
          {/*</FormGroup> */}

          {/* <TxFeeCalculator
            args={txFeeArgs}
            methodName="addLiquidityToV2"
            contractName="BTCWrapperProxy"
            className="tw-mt-6"
          /> */}

          {/*{topupLocked?.maintenance_active && (*/}
          {/*  <ErrorBadge content={topupLocked?.message} />*/}
          {/*)}*/}

          <DialogButton
            confirmLabel={t(translations.liquidityMining.modals.deposit.cta)}
            onConfirm={() => handleConfirm()}
            disabled={false}
            className="tw-rounded-lg"
          />
        </div>
      </Dialog>
      {/* <TxDialog tx={tx} onUserConfirmed={() => props.onCloseModal()} /> */}
    </>
  );
}
