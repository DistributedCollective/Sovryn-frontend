import React from 'react';
import {
  AmountSelectorInner,
  IAmountInputProps,
} from 'app/components/Form/AmountInput';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';
import { AssetSelect } from 'app/components/AssetSelect';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Input } from 'app/components/Form/Input';

export const AmountInput: React.FC<IAmountInputProps & { balance: string }> = ({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  step = 1,
  asset,
  assetString,
  assetSelectable,
  onSelectAsset,
  subText,
  maxAmount,
  readonly,
  showBalance,
  dataActionId,
  gasFee,
  balance,
}) => {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        appendElem={
          asset || assetString ? (
            assetSelectable ? (
              <AssetSelect
                selected={asset}
                selectedAssetString={assetString}
                onChange={onSelectAsset}
              />
            ) : (
              <AssetRenderer asset={asset} assetString={assetString} />
            )
          ) : null
        }
        className="tw-rounded-lg tw-max-w-full"
        appendClassName={assetSelectable ? '' : 'tw-mr-5'}
        readOnly={readonly}
        step={step}
        dataActionId={dataActionId}
      />
      {subText && (
        <div className="tw-text-xs tw-mt-1 tw-font-thin">{subText}</div>
      )}
      {!readonly && (asset || maxAmount !== undefined) && (
        <AmountSelectorInner
          balance={balance}
          parentValue={value}
          asset={asset}
          maxAmount={maxAmount}
          gasFee={gasFee}
          onChange={onChange}
          showBalance={showBalance}
        />
      )}
    </>
  );
};
