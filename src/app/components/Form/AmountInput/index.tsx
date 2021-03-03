import React from 'react';
import { Input } from '../Input';
import { Asset } from '../../../../types/asset';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { fromWei } from '../../../../utils/blockchain/math-helpers';

interface Props {
  value: string;
  onChange: (value: string) => void;
  asset?: Asset;
  placeholder?: string;
}

export function AmountInput(props: Props) {
  return (
    <>
      <Input
        value={props.value}
        onChange={props.onChange}
        type="number"
        placeholder={props.placeholder || '0.0000'}
        appendElem={
          props.asset ? AssetsDictionary.get(props.asset)?.symbol : null
        }
        {...props}
      />
      {props.asset && (
        <AmountSelector asset={props.asset} onChange={props.onChange} />
      )}
    </>
  );
}

const amounts = [10, 25, 50, 75, 100];

interface AmountSelectorProps {
  asset: Asset;
  onChange: (value: string) => void;
}

function AmountSelector(props: AmountSelectorProps) {
  const { value: balance } = useAssetBalanceOf(props.asset);
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
    console.log(balance, percent);
  };
  return (
    <div className="tw-mt-4 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary lg:tw-rounded-full tw-divide-x tw-divide-secondary">
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
