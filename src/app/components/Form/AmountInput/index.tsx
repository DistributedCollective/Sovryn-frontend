import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';

import { Asset } from '../../../../types';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { AssetRenderer } from '../../AssetRenderer';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { AvailableBalance } from '../../../components/AvailableBalance';
import { Input } from '../Input';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';

interface Props {
  value: string;
  onChange: (value: string, isTotal?: boolean | undefined) => void;
  decimalPrecision?: number;
  step?: number;
  asset?: Asset;
  assetString?: string;
  subText?: string;
  placeholder?: string;
  maxAmount?: string;
  readonly?: boolean;
  showBalance?: boolean;
}

export function AmountInput({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  step = 1,
  asset,
  assetString,
  subText,
  maxAmount,
  readonly,
  showBalance,
}: Props) {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        appendElem={
          asset || assetString ? (
            <AssetRenderer asset={asset} assetString={assetString} />
          ) : null
        }
        className="tw-rounded-lg"
        readOnly={readonly}
        step={step}
      />
      {subText && (
        <div className="tw-text-xs tw-mt-1 tw-font-thin">{subText}</div>
      )}
      {!readonly && (asset || maxAmount !== undefined) && (
        <AmountSelector
          asset={asset}
          maxAmount={maxAmount}
          onChange={onChange}
          showBalance={showBalance}
        />
      )}
    </>
  );
}

const amounts = [10, 25, 50, 75, 100];

interface AmountSelectorProps {
  asset?: Asset;
  maxAmount?: string;
  showBalance?: boolean;
  onChange: (value: string, isTotal: boolean) => void;
}

export function AmountSelector(props: AmountSelectorProps) {
  const { value } = useAssetBalanceOf(props.asset || Asset.RBTC);
  const balance = useMemo(() => {
    if (props.maxAmount !== undefined) {
      return props.maxAmount;
    }
    return value;
  }, [props.maxAmount, value]);

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
    props.onChange(fromWei(value), isTotal);
  };
  return (
    <>
      {props.showBalance && (
        <div className="tw-mt-2">
          <AvailableBalance asset={props.asset || Asset.RBTC} />
        </div>
      )}
      <div className="tw-h-5 tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
        {amounts.map(value => (
          <AmountSelectorButton
            key={value}
            text={`${value}%`}
            onClick={() => handleChange(value)}
          />
        ))}
      </div>
    </>
  );
}

interface AmountButtonProps {
  text?: string;
  onClick?: () => void;
}

export function AmountSelectorButton(props: AmountButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className="tw-h-5 tw-text-secondary tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-text-xs tw-leading-none tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25"
    >
      {props.text}
    </button>
  );
}
