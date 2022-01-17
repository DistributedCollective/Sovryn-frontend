import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';

import { Asset } from '../../../../types';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { AssetRenderer } from '../../AssetRenderer';
import { AssetSelect } from 'app/components/AssetSelect';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { Input } from '../Input';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';

interface IAmountInputProps {
  value: string;
  onChange: (value: string, isTotal?: boolean | undefined) => void;
  decimalPrecision?: number;
  asset?: Asset;
  assetString?: string;
  assetSelectable?: boolean;
  onSelectAsset?: (asset: Asset) => void;
  subText?: string;
  subElement?: React.ReactNode;
  placeholder?: string;
  maxAmount?: string;
  readonly?: boolean;
  showBalance?: boolean;
  hideAmountSelector?: boolean;
  dataActionId?: string;
}

export const AmountInput: React.FC<IAmountInputProps> = ({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  asset,
  assetString,
  assetSelectable,
  onSelectAsset,
  subText,
  subElement,
  maxAmount,
  readonly,
  showBalance,
  hideAmountSelector,
  dataActionId,
}) => (
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
      dataActionId={`${dataActionId}-amountInput`}
    />
    {subText && (
      <div className="tw-text-xs tw-mt-1 tw-font-thin">{subText}</div>
    )}
    {subElement && <>{subElement}</>}
    {!readonly && !hideAmountSelector && (asset || maxAmount !== undefined) && (
      <AmountSelector
        parentValue={value}
        asset={asset}
        maxAmount={maxAmount}
        onChange={onChange}
        showBalance={showBalance}
        dataActionId={dataActionId}
      />
    )}
  </>
);

const amounts = [10, 25, 50, 75, 100];

interface IAmountButtonProps {
  parentValue?: string;
  asset?: Asset;
  maxAmount?: string;
  showBalance?: boolean;
  dataActionId?: string;
  onChange: (value: string, isTotal: boolean) => void;
}

export const AmountSelector: React.FC<IAmountButtonProps> = ({
  maxAmount,
  asset,
  onChange,
  dataActionId,
}) => {
  const { value } = useAssetBalanceOf(asset || Asset.RBTC);
  const balance = useMemo(() => {
    if (maxAmount !== undefined) {
      return maxAmount;
    }
    return value;
  }, [maxAmount, value]);

  const handleChange = (percent: number) => {
    let value = '0';
    let isTotal = false;
    if (percent === 100) {
      value = balance;
      isTotal = true;
    } else if (percent === 0) {
      value = '0';
    } else {
      value = bignumber(balance)
        .mul(percent / 100)
        .toString();
    }
    onChange(fromWei(value), isTotal);
  };
  return (
    <div className="tw-h-5 tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
      {amounts.map(value => (
        <AmountSelectorButton
          key={value}
          text={`${value}%`}
          onClick={() => handleChange(value)}
          dataActionId={dataActionId}
        />
      ))}
    </div>
  );
};

interface AmountButtonProps {
  text?: string;
  onClick?: () => void;
  dataActionId?: string;
}

export function AmountSelectorButton(props: AmountButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className="tw-h-5 tw-text-secondary tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-text-xs tw-leading-none tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25"
      data-action-id={`${props.dataActionId}-send-amountSelectorButton-${props.text}`}
    >
      {props.text}
    </button>
  );
}
