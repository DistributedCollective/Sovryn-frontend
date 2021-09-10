import { bignumber } from 'mathjs';
import React, { useCallback, useMemo } from 'react';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';
import { Input } from '../../../../components/Form/Input';
import { AssetModel } from '../../types/asset-model';
import { AmountSelectorButton } from '../../../../components/Form/AmountInput';

interface Props {
  value: string;
  onChange: (value: string) => void;
  decimalPrecision?: number;
  asset: AssetModel;
  subText?: string;
  placeholder?: string;
  maxAmount?: string;
}

export function AmountInput({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  asset,
  subText,
  maxAmount,
}: Props) {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        appendElem={asset ? asset.symbol : null}
      />
      {subText && (
        <div className="tw-text-xs tw-mt-1 tw-font-thin">{subText}</div>
      )}
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
  asset: AssetModel;
  maxAmount?: string;
  onChange: (value: string) => void;
}

export function AmountSelector(props: AmountSelectorProps) {
  const balance = useMemo(() => {
    if (props.maxAmount !== undefined) {
      return props.maxAmount;
    }
    return '0';
  }, [props.maxAmount]);

  const handleChange = useCallback(
    (percent: number) => {
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
      props.onChange(props.asset.fromWei(value));
    },
    [balance, props],
  );
  return (
    <div
      className="tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded tw-divide-x tw-divide-secondary"
      style={{
        maxWidth: '340px',
      }}
    >
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
