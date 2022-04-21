import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from '../../../../types';
import { fromWei } from '../../../../utils/blockchain/math-helpers';
import { AssetRenderer } from '../../AssetRenderer';
import { AssetSelect } from 'app/components/AssetSelect';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { Input } from '../Input';
import {
  stringToFixedPrecision,
  toNumberFormat,
} from 'utils/display-text/format';
import { translations } from 'locales/i18n';
import classNames from 'classnames';

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
  subElement?: React.ReactNode;
  placeholder?: string;
  maxAmount?: string;
  readonly?: boolean;
  showBalance?: boolean;
  hideAmountSelector?: boolean;
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
  subElement,
  maxAmount,
  readonly,
  showBalance,
  hideAmountSelector,
  dataActionId,
  gasFee,
}) => {
  return (
    <>
      <Input
        value={stringToFixedPrecision(value, decimalPrecision)}
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
        step={step}
        readOnly={readonly}
        dataActionId={`${dataActionId}-amountInput`}
        onChange={onChange}
      />
      {subText && (
        <div className="tw-text-xs tw-mt-1 tw-font-extralight">{subText}</div>
      )}
      {subElement && <>{subElement}</>}
      {!readonly &&
        !hideAmountSelector &&
        (asset || maxAmount !== undefined) && (
          <AmountSelector
            asset={asset}
            maxAmount={maxAmount}
            gasFee={gasFee}
            onChange={onChange}
            dataActionId={dataActionId}
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
  gasFee?: string;
  onChange: (value: string, isTotal: boolean) => void;
  dataActionId?: string;
  showBalance?: boolean;
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
  onChange,
  dataActionId,
  showBalance,
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
      <div
        className={classNames(
          showBalance ? 'tw-mt-1' : 'tw-mt-2.5',
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-secondary tw-rounded-md tw-divide-x tw-divide-secondary',
        )}
      >
        {amounts.map(value => (
          <AmountSelectorButton
            key={value}
            text={value === 100 ? t(translations.common.max) : `${value}%`}
            onClick={() => handleChange(value)}
            dataActionId={dataActionId}
          />
        ))}
      </div>
    </>
  );
};

export enum AmountSelectorButtonPadding {
  Normal = 'tw-px-4',
  Small = 'tw-px-2',
}

interface IAmountButtonProps {
  text?: string;
  onClick?: () => void;
  dataActionId?: string;
  appendText?: string;
  padding?: AmountSelectorButtonPadding;
}

export const AmountSelectorButton: React.FC<IAmountButtonProps> = ({
  text,
  onClick,
  dataActionId,
  appendText = '',
  padding = AmountSelectorButtonPadding.Normal,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'tw-text-secondary tw-bg-secondary tw-bg-opacity-0 tw-font-medium tw-text-xs tw-leading-none tw-py-1 tw-text-center tw-w-full tw-transition hover:tw-bg-opacity-25',
        padding,
      )}
      data-action-id={`${dataActionId}-amountSelectorButton-${text}`}
    >
      {`${text}${appendText}`}
    </button>
  );
};
