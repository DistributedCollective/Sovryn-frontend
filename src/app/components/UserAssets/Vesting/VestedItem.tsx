import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';
import { LoadableValue } from '../../LoadableValue';
import { weiToNumberFormat } from '../../../../utils/display-text/format';
import { translations } from '../../../../locales/i18n';
import { ActionButton } from '../../Form/ActionButton';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { FullVesting } from './types';
import { useDollarValue } from '../../../hooks/useDollarValue';
import { useGetVesting } from './useGetVesting';
import { AssetValue } from 'app/components/AssetValue';

type VestedItemProps = {
  vesting: FullVesting;
  onWithdraw: (vesting: FullVesting) => void;
  frozen?: boolean;
};

export const VestedItem: React.FC<VestedItemProps> = ({
  vesting,
  onWithdraw,
  frozen,
}) => {
  const { value, loading } = useGetVesting(vesting);

  const { logoSvg } = AssetsDictionary.get(vesting.asset);

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.WITHDRAW_VESTS);
  const dollarValue = useDollarValue(vesting.asset, value.balance);

  const handleOnWithdraw = useCallback(() => onWithdraw(value), [
    value,
    onWithdraw,
  ]);

  return (
    <tr>
      <td>
        <img
          className="tw-inline tw-mr-2 tw-h-8 tw-w-8"
          src={logoSvg}
          alt={vesting.asset}
        />{' '}
        {t(translations.stake.currentVests.assetType[vesting.type])}
      </td>
      <td className="tw-text-right">
        <LoadableValue
          loading={loading}
          value={weiToNumberFormat(value.balance, 4)}
        />
      </td>
      <td className="tw-text-right">
        <LoadableValue
          value={<AssetValue value={dollarValue.value} assetString="USD" />}
          loading={dollarValue.loading || loading}
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
            />
          </Tooltip>
        ) : (
          <ActionButton
            className="tw-inline-block"
            text={t(translations.userAssets.actions.withdraw)}
            onClick={handleOnWithdraw}
            disabled={loading || frozen}
            loading={loading}
            dataActionId={`portfolio-action-withdraw-${vesting.type}`}
          />
        )}
      </td>
    </tr>
  );
};
