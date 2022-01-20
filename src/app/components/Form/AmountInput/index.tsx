import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from '../../../../types';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { AssetRenderer } from '../../AssetRenderer';
import { AssetSelect } from 'app/components/AssetSelect';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { AvailableBalance } from '../../../components/AvailableBalance';
import { Input } from '../Input';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';
import { translations } from 'locales/i18n';

export interface IAmountInputProps {
  value: string;
  onChange: (value: string, isTotal?: boolean | undefined) => void;
  decimalPrecision?: number;
  step?: number;
  asset?: Asset;
  assetString?: string;
  assetSelectable?: boolean;
  onSelectAsset?: (asset: Asset) => void;
  subText?: string;
  placeholder?: string;
  maxAmount?: string;
  readonly?: boolean;
  showBalance?: boolean;
  dataActionId?: string;
  gasFee?: string;
}

export const AmountInput: React.FC<IAmountInputProps> = ({
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
        <AmountSelector
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

const amounts = [10, 25, 50, 75, 100];

interface IAmountSelectorProps {
  balance?: string;
  parentValue?: string;
  asset?: Asset;
  maxAmount?: string;
  showBalance?: boolean;
  gasFee?: string;
  onChange: (value: string, isTotal: boolean) => void;
}

export const AmountSelector: React.FC<IAmountSelectorProps> = props => {
  const { value } = useAssetBalanceOf(props.asset || Asset.RBTC);
  return <AmountSelectorInner {...props} balance={value} />;
};

export const AmountSelectorInner: React.FC<IAmountSelectorProps> = ({
  asset = Asset.RBTC,
  maxAmount,
  gasFee = '0',
  balance: value = '0',
  showBalance,
  onChange,
}) => {
  const { t } = useTranslation();
  const balance = useMemo(() => {
    if (maxAmount !== undefined) {
      return maxAmount;
    }
    return value;
  }, [maxAmount, value]);

  const handleChange = (percent: number) => {
    let _value = '0';
    let isTotal = false;
    if (percent === 100) {
      _value = balance;
      isTotal = true;
    } else if (percent === 0) {
      _value = '0';
    } else {
      _value = bignumber(balance)
        .mul(percent / 100)
        .toString();
    }

    if (
      asset === Asset.RBTC &&
      bignumber(_value)
        .add(gasFee || '0')
        .greaterThan(balance)
    ) {
      _value = bignumber(_value)
        .minus(gasFee || '0')
        .toString();
    }

    onChange(fromWei(_value), isTotal);
  };

  return (
    <>
      {showBalance && (
        <div className="tw-mt-2">
          <AvailableBalance asset={asset || Asset.RBTC} />
        </div>
      )}
      <div className="tw-h-5 tw-mt-1 tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary">
        {amounts.map(value => (
          <AmountSelectorButton
            key={value}
            text={value === 100 ? t(translations.common.max) : `${value}%`}
            onClick={() => handleChange(value)}
          />
        ))}
      </div>
    </>
  );
};

interface IAmountButtonProps {
  text?: string;
  onClick?: () => void;
}

export const AmountSelectorButton: React.FC<IAmountButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="tw-text-secondary tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-text-xs tw-leading-none tw-px-4 tw-py-1 tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25 focus:tw-bg-opacity-50 tw-uppercase"
      data-action-id={`swap-send-amountSelectorButton-${text}`}
    >
      {text}
    </button>
  );
};
