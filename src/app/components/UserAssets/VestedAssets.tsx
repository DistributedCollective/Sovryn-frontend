import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { AssetDetails } from '../../../utils/models/asset-details';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { LoadableValue } from '../LoadableValue';
import { Skeleton } from '../PageSkeleton';
import { useVestedStaking_balanceOf } from './useVestedStaking_balanceOf';
import { VestingDialog } from './VestingDialog';
import { ActionButton } from 'app/components/Form/ActionButton';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { OriginsSaleRow } from './OriginsSaleRow';
import babelfishLogo from 'assets/images/babelfish.svg';

export function VestedAssets() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();

  const item = AssetsDictionary.get(Asset.CSOV);
  const result = useVestedStaking_balanceOf(account);

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');

  const onWithdraw = (contract: string) => {
    setOpen(true);
    setAddress(contract);
  };

  const onClose = () => {
    setOpen(false);
    setAddress('');
  };

  const userHasAnyVests = useMemo(
    () =>
      result.vestedValue !== '0' ||
      result.originVestedValue !== '0' ||
      result.teamVestedValue !== '0' ||
      result.lmVestingContract !== ethGenesisAddress ||
      result.babelFishVestedValue !== '0',
    [
      result.babelFishVestedValue,
      result.lmVestingContract,
      result.originVestedValue,
      result.teamVestedValue,
      result.vestedValue,
    ],
  );

  return (
    <>
      <div className="sovryn-border sovryn-table tw-pt-1 tw-pb-4 tw-pr-4 tw-pl-4 tw-mb-12">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="tw-text-right">
                {t(translations.userAssets.tableHeaders.lockedAmount)}
              </th>
              <th className="text-right d-none d-md-table-cell">
                {t(translations.userAssets.tableHeaders.dollarBalance)}
              </th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.action)}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {(!connected || result.loading) && (
              <>
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {connected &&
              account &&
              !result.loading &&
              (userHasAnyVests ? (
                <>
                  {result.vestedValue !== '0' && (
                    <AssetRow
                      item={item}
                      title="Genesis SOV"
                      value={result.vestedValue}
                      loading={result.loading}
                      contract={result.vestingContract}
                      onWithdraw={onWithdraw}
                    />
                  )}

                  {result.originVestedValue !== '0' && (
                    <AssetRow
                      item={item}
                      title="Origins SOV"
                      value={result.originVestedValue}
                      loading={result.loading}
                      contract={result.originVestingContract}
                      onWithdraw={onWithdraw}
                    />
                  )}

                  {result.teamVestedValue !== '0' && (
                    <AssetRow
                      item={item}
                      title="Team SOV"
                      value={result.teamVestedValue}
                      loading={result.loading}
                      contract={result.teamVestingContract}
                      onWithdraw={onWithdraw}
                    />
                  )}
                  {result.lmVestingContract !== ethGenesisAddress && (
                    <AssetRow
                      item={item}
                      title="Reward SOV"
                      value={result.lmVestedValue}
                      loading={result.loading}
                      contract={result.lmVestingContract}
                      onWithdraw={onWithdraw}
                    />
                  )}
                  {result.babelFishVestedValue !== '0' && (
                    <OriginsSaleRow
                      token="FISH"
                      value={result.babelFishVestedValue}
                      title="Origins FISH"
                      logo={babelfishLogo}
                      loading={result.loading}
                    />
                  )}
                </>
              ) : (
                <tr>
                  <td className="text-center" colSpan={99}>
                    {t(translations.userAssets.emptyVestTable)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <VestingDialog address={address} onClose={onClose} isOpen={open} />
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
  value: string;
  title: string;
  loading: boolean;
  contract: string;
  onWithdraw: (type: string) => void;
}

function AssetRow({
  item,
  value,
  title,
  loading,
  contract,
  onWithdraw,
}: AssetProps) {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.WITHDRAW_VESTS);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = useMemo(() => {
    if ([Asset.USDT, Asset.DOC].includes(item.asset)) {
      return value;
    } else {
      return bignumber(value)
        .mul(dollars.value)
        .div(10 ** item.decimals)
        .toFixed(0);
    }
  }, [dollars.value, value, item.asset, item.decimals]);

  return (
    <tr key={item.asset}>
      <td>
        <img
          className="tw-inline tw-mr-2"
          style={{ height: '40px' }}
          src={item.logoSvg}
          alt={item.asset}
        />{' '}
        {title}
      </td>
      <td className="tw-text-right">
        <LoadableValue value={weiToNumberFormat(value, 4)} loading={loading} />
      </td>
      <td className="tw-text-right">
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-right">
        {withdrawLocked ? (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.withdrawVests)}</>}
          >
            <ActionButton
              className="tw-inline-block tw-cursor-not-allowed"
              text={t(translations.userAssets.actions.withdraw)}
              disabled={contract === ethGenesisAddress || loading}
            />
          </Tooltip>
        ) : (
          <ActionButton
            className="tw-inline-block"
            text={t(translations.userAssets.actions.withdraw)}
            disabled={contract === ethGenesisAddress || loading}
            onClick={() => onWithdraw(contract)}
          />
        )}
      </td>
    </tr>
  );
}
