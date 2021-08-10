import { useSelector } from 'react-redux';
import { selectBridgeDepositPage } from '../../selectors';
import React, { useCallback, useMemo } from 'react';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { Chain } from '../../../../../types';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { AssetModel } from '../../types/asset-model';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { bignumber } from 'mathjs';
import { SelectBox } from '../SelectBox';
import cn from 'classnames';
import { LoadableValue } from '../../../../components/LoadableValue';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function TokenItem({ sourceAsset, image, symbol, onClick }) {
  const { t } = useTranslation();
  const { chain, targetChain } = useSelector(selectBridgeDepositPage);
  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const balance = useTokenBalance(chain as any, asset);
  const isDisabled = useCallback(
    () => !bignumber(balance.value).greaterThan(0),
    [balance],
  );

  return (
    <div>
      <SelectBox onClick={onClick} disabled={isDisabled()}>
        <img src={image} alt={symbol} className="tw-w-16 tw-h-16" />
      </SelectBox>
      <div
        className={cn('tw-flex tw-flex-col tw-items-center tw-mt-2', {
          'tw-opacity-25': isDisabled() && !balance.loading,
        })}
      >
        <span className="tw-text-sm tw-font-light tw-mb-1">
          {t(translations.common.availableBalance)}
        </span>
        <LoadableValue
          value={`${toNumberFormat(
            asset.fromWei(balance.value),
            asset.minDecimals,
          )} ${asset.symbol}`}
          loading={balance.loading}
        />
      </div>
    </div>
  );
}
