import { useSelector } from 'react-redux';
import { selectBridgeWithdrawPage } from '../../selectors';
import React, { useMemo } from 'react';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { Chain } from '../../../../../types';
import { CrossBridgeAsset } from '../../../BridgeDepositPage/types/cross-bridge-asset';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { bignumber } from 'mathjs';
import { SelectBox } from '../../../BridgeDepositPage/components/SelectBox';
import cn from 'classnames';
import { LoadableValue } from '../../../../components/LoadableValue';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function TokenItem({
  sourceAsset,
  balance,
  loading = false,
  image,
  symbol,
  onClick,
}) {
  const { t } = useTranslation();
  const { chain, targetChain } = useSelector(selectBridgeWithdrawPage);
  const asset = useMemo(
    () =>
      BridgeDictionary.get(targetChain as Chain, chain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const isDisabled = useMemo(() => !bignumber(balance).greaterThan(0), [
    balance,
  ]);

  return (
    <div>
      <SelectBox onClick={onClick} disabled={isDisabled}>
        <img src={image} alt={symbol} className="tw-w-16 tw-h-16" />
      </SelectBox>
      <div
        className={cn('tw-flex tw-flex-col tw-items-center tw-mt-2', {
          'tw-opacity-25': isDisabled && !balance.loading,
        })}
      >
        <span className="tw-text-sm tw-font-light tw-mb-1">
          {t(translations.BridgeWithdrawPage.tokenSelector.maxWithdrawal)}
        </span>
        <LoadableValue
          value={`${toNumberFormat(balance, asset.minDecimals)} ${
            asset.symbol
          }`}
          loading={loading}
        />
      </div>
    </div>
  );
}
