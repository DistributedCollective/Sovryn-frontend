import { bignumber } from 'mathjs';
import React, { useCallback, useMemo } from 'react';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';
import { Input } from '../../../../components/Form/Input';
import { AssetModel } from '../../types/asset-model';
import { AmountSelectorButton } from '../../../../components/Form/AmountInput';

interface IAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  decimalPrecision?: number;
  asset: AssetModel;
  subText?: string;
  placeholder?: string;
  maxAmount?: string;
}

export const AmountInput: React.FC<IAmountInputProps> = ({
  value,
  onChange,
  placeholder = toNumberFormat(0, 6),
  decimalPrecision = 6,
  asset,
  subText,
  maxAmount,
}) => {
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
};

const amounts = [10, 25, 50, 75, 100];

interface IAmountSelectorProps {
  asset: AssetModel;
  maxAmount?: string;
  onChange: (value: string) => void;
}

export const AmountSelector: React.FC<IAmountSelectorProps> = ({
  asset,
  maxAmount,
  onChange,
}) => {
  const balance = useMemo(() => {
    if (maxAmount !== undefined) {
      return maxAmount;
    }
    return '0';
  }, [maxAmount]);

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
      onChange(asset.fromWei(value));
    },
    [balance, asset, onChange],
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
};
