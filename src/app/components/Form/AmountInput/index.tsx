import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';

import { Asset } from '../../../../types';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { AssetRenderer } from '../../AssetRenderer';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { Input } from '../Input';
import { stringToFixedPrecision } from 'utils/display-text/format';

interface Props {
  value: string;
  onChange: (value: string) => void;
  decimalPrecision?: number;
  asset?: Asset;
  placeholder?: string;
  maxAmount?: string;
}

export function AmountInput({
  value,
  onChange,
  placeholder = '0.000000',
  decimalPrecision = 6,
  asset,
  maxAmount,
}: Props) {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        appendElem={asset ? <AssetRenderer asset={asset} /> : null}
      />
      {(asset || maxAmount !== undefined) && (
        <AmountSelector
          asset={asset}
          maxAmount={maxAmount}
          onChange={onChange}
        />
      )}
    </>
  );
}

const amounts = [10, 25, 50, 75, 100];

interface AmountSelectorProps {
  asset?: Asset;
  maxAmount?: string;
  onChange: (value: string) => void;
}

function AmountSelector(props: AmountSelectorProps) {
  const { value } = useAssetBalanceOf(props.asset || Asset.RBTC);
  const balance = useMemo(() => {
    if (props.maxAmount !== undefined) {
      return props.maxAmount;
    }
    return value;
  }, [props.maxAmount, value]);

  const handleChange = (percent: number) => {
    let value = '0';
    if (percent === 100) {
      value = balance;
    } else if (percent === 0) {
      value = '0';
    } else {
      value = bignumber(balance)
        .mul(percent / 100)
        .toString();
    }
    props.onChange(fromWei(value));
  };
  return (
    <div className="tw-mt-4 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded tw-divide-x tw-divide-secondary">
      {amounts.map(value => (
        <AmountSelectorButton
          key={value}
          text={`${value}%`}
          onClick={() => handleChange(value)}
        />
      ))}
    </div>
  );
}

interface AmountButtonProps {
  text?: string;
  onClick?: () => void;
}

function AmountSelectorButton(props: AmountButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className="tw-text-secondary tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-text-sm tw-leading-none tw-px-2 tw-py-2 tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25"
    >
      {props.text}
    </button>
  );
}
